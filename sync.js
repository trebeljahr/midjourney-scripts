const axios = require('axios');
const fs = require('fs');
const fse = require('fs-extra');

const userId = fs.readFileSync('userid.txt', 'utf-8').trim();
const totalPages = 21;

async function syncFromMidjourney() {
  console.log("Enter your Midjourney session token (eyJ...): ");
  process.stdin.setEncoding('utf-8');
  const sessionToken = await new Promise((resolve) => process.stdin.once('data', (data) => resolve(data.trim())));

  const instance = axios.create({
    baseURL: 'https://www.midjourney.com',
    headers: {
      'User-Agent': 'Midjourney-history-sync/1.0',
      'Content-Type': 'application/json',
      'Cookie': `__Secure-next-auth.session-token=${sessionToken}`,
    },
  });

  for (let page = 1; page <= totalPages; page++) {
    const response = await instance.get(`/api/app/recent-jobs`, {
      params: {
        orderBy: 'new',
        jobStatus: 'completed',
        userId,
        dedupe: true, 
        refreshApi: 0,
        amount: 50,
        page,
        jobType: 'upscale',
      },
    });

    const jobs = response.data;
    fs.writeFileSync('jobs/last.json', JSON.stringify(jobs, null, 2));

    for (const job of jobs.sort((a, b) => a.enqueue_time - b.enqueue_time)) {
      const jobId = job.id;
      const tdir = `./jobs/${jobId}`;

      if (fs.existsSync(tdir)) {
        if (fs.existsSync(`${tdir}/completed`)) {
          console.log(`Skipping ${jobId} -- already downloaded.`);
          continue;
        } else {
          console.log(`Warning: ${jobId} did not finish syncing. Will try again!`);
        }
      } else {
        console.log(`Downloading ${jobId}`);
        fs.mkdirSync(tdir, { recursive: true });
      }

      fs.writeFileSync(`${tdir}/job.json`, JSON.stringify(job, null, 2));

      const downloadPromises = job.image_paths.map(async (imgUrl) => {
        const fname = imgUrl.split('/').pop().split('?')[0];
        console.log(`  ${fname}`);

        const imgResponse = await instance.get(imgUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(`${tdir}/${fname}`, Buffer.from(imgResponse.data));
      });

      await Promise.all(downloadPromises);

      fs.writeFileSync(`${tdir}/completed`, '');
    }
  }

  console.log('Sync completed.');
  process.exit(0);
}

syncFromMidjourney()