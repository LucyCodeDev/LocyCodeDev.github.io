import axios from "axios";
import cheerio from "cheerio";

export async function getLottoDrawInfo() {
  const url = "https://dhlottery.co.kr/gameResult.do?method=byWin";
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const round = $(".win_result h4 strong").text().replace(/[^0-9]/g, "");

  return { round: parseInt(round) };
}
