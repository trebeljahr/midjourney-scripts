import inquirer from "inquirer";
import axios, { AxiosError } from "axios";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const userId = readFileSync("userid.txt", "utf-8").trim();
const totalPages = 21;

async function syncFromMidjourney() {
  console.log("Enter your Midjourney session token (eyJ...): ");

  // const { sessionToken } = await inquirer.prompt([
  //   {
  //     type: "input",
  //     message: "Enter your midjourney session token here:",
  //     name: "sessionToken",
  //   },
  // ]);

  const sessionToken =
    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Cpj9rJ0v7ur_Jkl6.qXPshpgq_j-NbErBjv6kZ3UfLXrsyQCkTze9d8537EdDRfss3OHC05tZ83jQ4tXDi0uko7mh7zo0auP24RKf5VcbjsyUXw176gbfoXrT0M4Rol3I9mhdqnhZ1Q_4eYsVKShm-JibyutbCO9rt3ScbohKuHs_eQiOF4WTyQXcTotmSJNi3o7bbBbvfmGxQbIaERu6O6l8B63UQmzGNA-xeOqxQdL0X1Vmei1eHMloFmVjxtSFzWxpdZ5RT-x4HDmKiAl2yMmskeLT25Z066kmF_Lctv-4XlDJhiJCu0VVaGHUOmry6U2N50dlDaamGyhPL45W1fcJKhULvZngJMprOl9O5HXkDJTeLvfaJoVE2RRjEe4PyLo2xNOaoyvBQvFp0liLQgMJfZ8mxrmFqY8aFUxSXkZftHfKpw6yKZ_U2uB27Itars0wuSlUGQS8IYKBGrVIYJKC-HHvE02iGEP5_R33k7BNKeZnTH3vX__MSOspiB5vGqUph9liJXwmRZ6myDxFlsPvuPCSN5ZXOswmLRHyUe_vYODQyv62uhLpG786AHCs6RJpcppBGokmWUhejdTFHqiYsIdpVRSfASrXr8rLaJxGOITnr7a47RbA5bZdH5hewkPgs5lHGeO0o1LgpYmqx6AIiXh66A0jY9qTQ45ZdoVQfVAZoZ2ADWoGQyn19x7UD_yQ3yWUuKjUqLTX1opb_fx4lVyZ6mu8nrkVigSvlUW5ooqny3UWSNaSVsR6-iwJwrf10bc1BeOH5RJ1WChTfJ5heh2FWek4InTpq3TfAiU3u5NjNG0GgUY5BpAUnJ7aYsg7TJ1BINtHeZ71RIZiXN7vBleSsz6TS9oEjOyW7RjWRYXi_eHF9yHYb_s-8nDjyuF8dEAsf6StRqEin7N_CP5D2IjEZxHq8l66FdaY3TDV0ymWpBOK-JSsbowmpUYxRjoklqr5kYQGqkEYnri6Nojxq-wsFs5VnrBhw7T0p78ArJB1TDctl2wY_IWkhzHPZ0Hn-4rHiizG14fYHua_Yg1btgvTiUhcjWAxjcXkoCBygiQ_5WD3Kyi275fLNf4n3sru73RKLET24lcKwtvynU5rVT9-EdEHEd29g2d84ub75hccFWCCriodjIR9NByLoh_gi-FkAJ31d4zvwW4X-jAFVv-_Db5-f1IlKwVc5KAGZMrd-0ykvSdkts3FvvhQ6zhe2J_NQvO_DmbPJRUiNbR9GQIDxB_39QuB6KP_YFCmM8lJmX4mmNcEbCbLCQs90g--M0wB71giH85lsdhLQBj-UmMrF6TD-r0yd7not_XkJ1UZXgOrP1EJEsBVV2AYLJhTf3UjufqIUEhrUWIAyEAc6P3EndRRiN0DIErvEyxGqTM3ykZrOuCEVbJPSbmmyX9KOS6JE5xLb5oThaE4EeAHjuY0cx3jSB2ClDRgwzmpUPneK4-s4aT76Osr9e2Wvsu-vxPpltzZvuWqbT1pcydp0N7M8G7F_K7RS96xI_p0myjjn-bGBQxT9CpsDryE5DUZemheXKXI16NSCOUS8XlfthY2y28OpGH5cahJQkWiSbdRFry_Zp_JqBfzryOqZvnrPBO6E_DYEw2lR36bga8fan5gL7KrbQWDuEm1i3H-nw16tmfDZDoUVEzvXPVyavC_zrrycSeZi7dYpW5hUEKejopRQfQ6ElJL5xx9QYXywwLJwZVQ7KiEJdtCLKJR1LrrzrnxbYAyQEqR_jSuI--9KLXtfFbp4mT940n7Itf2ME_rT5UUmgof8B0_66SP33vmsmYFYSnNWXraE6s9itqiU_mBFrzxbIpv-F-8CbE-Beu7BdzpV5XoEZRe_06-Utd0Oi0uyvvc8SJgtfIerG3F2D9E__HC7BxywwE7CB3PpgKwJHABevZcd-jjQHsDThGO00aC0xhr9ygb_z45xJCV8LUKshZCqM_KkmUXjwFqsXCph_X_1rZNKBfJOsn1Dmbwzzs_VBeSw475IUh_24D1WiWjJL8K5AOZkRbNJHJuQP8wOkjO-WsawvUTgbQnsElwcby0pDBaPKabi4ntq7TDpWzaQeFXN1YXEBrTXWTZNMqFIW-66Q6pU7Lz13Zoym7LqWgwShZHxwPV5gXaQoiEZqQLBZIcB-BAUzx6uOG9HApwin4IfJeI8n--0jiEF_xQYKqCmTQ1hEEc82vSx2cp0vEHOddZX4lTm6lVeeoQsj-8BlY2paE.vmXeZfuSg8_Z61HmtEzYNw";
  const csrfToken =
    "d304c9e3006aa9715a0ff0582c1928b03b8860b4c244cc1b4d23635658ed82cc%7C2aef0a2d525979f162099aaccae46b750e5af8e3f269527c443c3a0612355e57";

  const userId = "8279a880-e345-48b1-a207-c77385215a29";
  const amount = 50;
  const page = 1;

  const url = `https://www.midjourney.com/api/app/recent-jobs/?amount=${amount}&dedupe=true&jobStatus=completed&jobType=upscale&orderBy=new&page=${page}&userId=${userId}`;
  const axiosHeaders = {
    "Content-Type": "application/json",
    Cookie: `__stripe_mid=419f74fb-7ce7-489f-98ae-8497eae20583c3becf; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.midjourney.com; imageSize=medium; imageLayout_2=hover; getImageAspect=2; fullWidth=false; showHoverIcons=true; __Host-next-auth.csrf-token=d304c9e3006aa9715a0ff0582c1928b03b8860b4c244cc1b4d23635658ed82cc%7C2aef0a2d525979f162099aaccae46b750e5af8e3f269527c443c3a0612355e57; AMP_MKTG_437c42b22c=JTdCJTdE; AMP_437c42b22c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjIwZTJiZTQxMy0yNjZlLTQ4ZTUtYTVhMi1lMDNlMTk5NGM4YTIlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjI4Mjc5YTg4MC1lMzQ1LTQ4YjEtYTIwNy1jNzczODUyMTVhMjklMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNjk2NDgyNzgyNTQ3JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTY5NjQ4NDMzMzY3OSUyQyUyMmxhc3RFdmVudElkJTIyJTNBMjUlN0Q=; cf_clearance=kgt5HYk3Zue7mkH6JPawpj0P9HerPUqDZ4KSijeHrVU-1696486218-0-1-54799ce1.cc576479.36fec96-0.2.1696486218; __cf_bm=S6nutufzm.Z0Rm73NFzEaaODCAPciHWaBg_3hXh3md0-1696486444-0-AY277y8WiFBWSBC3tIFa/Lax2fEaxPjdMiTWAmJGlekvqCWb2eqSbHEvhDZcP4oJ0cZXnxG5WtvRuwp08tDpCM4=; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..sY6OlPLbjCJfKfxV.TkMiPaAGtZblgAMGvwQ3-OeDgyCpgprSSGFB9QIfNSd2rq3UKrf41yH4zLRVaMW7yM8KPMHb7ohE4cthrvdpen8icWa4h0PPVPbkHV7YiWEI4W7GV6hcl-hXHfdzcMDApULvKYzU4q8CyA_TO2Jq4XzP7fIgu4b3aC4wQbyedOV5HD-OG5mDavlAyvFKaYOr_08znaRngq7TsA4ytoYaNBBKjI18aqdgekgWcoK8Mdabj5oAkzjpisZ8i-_AO7Wj0ek-L7oXmx-OoycWjOx-qfmImPyZmmhNxKGdSm_8t8YTFL1TzEM9jKQ9i2rwR9pfiixoQqMwz_GqTphCy_strx8FdPHpn0HTDaGnQACsWBMCcKtFaELdOjJk2fSlAsZ_TMnrTHiw1gtZeZqn-RZ-s2fSMNHmTkI_6_Rr4dQqnxg_IMDELL32Jbq_naz4GzkRAZCVLIfxeuHs9YdeI9OPHJV5As4sg7Z_ZuzTGDevwcZicx6rEAkfhRfu5zJnx1pU7VWsEsLzgbk-Pv_NHzuSRFqN6Hodt1ppjx56CydXpevtVjHSivoPTusuiv54zJlsewk-tHLW8YvOpmf_rIbyV_MAZXXMS2wCK9LzQmn7etS2d9I5EmwhyxnsyECftXNG6JholoNclOyTwgrz1HEp7P0n1Hzrn8l1eceEiuePXSOCA283kV49z34xJKIMcMbY3vTRPf1IriKth_AFgBi14-vxnfH8iC8X4GFvIXT0TnA1BgyMcBEDvbRD3HzHwkP4fPuSNlYEcxQJtg1sGN8tvyQ4NijTaaRImBhqutcSPt0OvpfPCTLtxP7LBzA4TV6099rHue2c4BotNGVJ60UBLq3ll0Ia_biHRg6-GPGJ4wKbS_3jUWjp-4vylilIm0Q3XvedX3z0f4k79Vd0iWJ8up2QMI6ZCLZrJRVpj6XFRaqoq_wZfZRrY2RzODDryd26Ww3zLagP6zqdgvJP5LkrEYxhzFXQ1aYezebwMqtuqGEsOMkcoVF2kIX31g_ngPGWATmNuKC0D6-kNsC3yuRh56_PmJI5U1-RnyND0GRO8X-P8F3BdSNSo1IiqgL2EXlq9N1WIeC_Rj9RBCwDTlCA5l9zgkYqeVyFqb4Fsv1R0Gp_-V7GVW_u7C8udjLTNm6CBHo114Te4H12V37caIIiMsfzzFfLbrd2oTyz9QnGJ_7SGh-kcvoEWyMfqFV-WNRwzYChU-Jd8DPC-M3j5LAtPGhL_0KTdEEygiwnWdCkyqMzM4JirBu9c2163fCp3I3cWhZSx0KlC7TqYpJTUGmDDYzxpkbZKqBOa3RokI3za-ndXD8L4jEHRQavNWxezWwwH_pS0WEzDpOWPHf_VLv8OerGx0PZ8j7rfwP0-LYVHmdSFo5_GbBsK_Jp-CudTBH8Ofrtz6trfSE0S0Zc8l3I_ZKfRcuonAYY_VZhEimG2cEKJhmqtyri4IJlexGN3UBl2TkO35l_cnCbQlY1xt2GY2W019roGh7RUb4hpzovk-K5ODuPFqLXHkBXSCVZYfDqWDzgboa4I_vMsoJYwLzNyeJOhNlSQJ18XmVUby1T0xf--XuO3mGKvK3Pkla-8MEsnBm-SVschNCEyLal4Z7jWZ9AxlRUxlrNvgB-P5-fH9SaH_zBpwXsiY7hF5fBUvIzK2xkm4xV_331QqB-lj0hzayL7Em0Qr-RvfECoajg0TAkELVWS8nOBpjF8LxvXYZkY9nq0D_9uE5EHBhTKuwvz2MoIF2dl28R9ucZ6u_vqBsWLRKnKmKZgcRhP4k7AmH99r0pm7GBiB43OGslvIZdyJF4yy5RJJWfm5GImPqFtg9jwR2Eu9f2AHOdBXTPBsv6nJb6CbvFQ7SjsZJf1ZC2TaHuW-oaiJNuxFDmXRig1aV7SLEKDGICY8D_6dwT0LbhW3M5p7MPzvUPAUxxVsTIMWxJwaIyCV3hnrcaxkvX7Q6JgCUaq7X4hQre8kmgvTnLdnVYEdvxYmN87r7vZXWSuLqrVFzP3Vg8rysEasbK6ZZZmq0oh-7NTo3tBkdoPk3NfWe6PB5NLEKaWcbqGr7yH-f1vkHmDNGWYGIgfTg2w5fcCgSRkNGGLtN6tIQ8Yme72JI-IwiC8UznQUiH1PpY-bP16wLZebFuYijzMsHQHD-kQv9SXo8e5GjQAdEnZA-T3i9Tn31clhgdLWs8GvNrlfUm-oMG6Hl-8pGtj_8.ZmvTtfvW9YYYw7TgFQ1cQQ; _dd_s=rum=0&expire=1696487377239`,
  };

  try {
    const { data } = await axios.get(url, { headers: axiosHeaders });
    console.log(data);
  } catch (err) {
    console.log(err.response.data);
    console.log(err.response.status);
    console.log(err.response.headers);
  }
}

await syncFromMidjourney();
