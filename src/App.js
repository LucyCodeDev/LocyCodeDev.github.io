import React, { useState, useEffect } from "react";
import { generateLottoNumbers } from "./utils";
import "./App.scss";
import qrcode from "./images/qrcode.png";
import lotto from "./images/lotto.png";

function App() {
  const [lottoNumbers, setLottoNumbers] = useState([[], [], [], [], []]);
  const [lastRoundData, setLastRoundData] = useState({});
  const [drawDate, setDrawDate] = useState(new Date());
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const indexToLetter = (index) => String.fromCharCode(65 + index);
  const handleClick = () => {
    const newLottoNumbers = generateLottoNumbers(5);
    setLottoNumbers(newLottoNumbers);
  };

  const getRoundNumberByDrawDate = (drawDate) => {
    const referenceDate = new Date(2002, 11, 7);
    const timeDifference = drawDate - referenceDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const weeksDifference = Math.round(daysDifference / 7);
    return weeksDifference + 1;
  };

  const fetchLastRoundData = async (round) => {
    const url = `/api/common.do?method=getLottoNumber&drwNo=${round}`;
    // const url = `https://cors-anywhere.herokuapp.com/https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;

    const headers = { "X-Requested-With": "xhr" };
    const response = await fetch(url, { headers });
    // const response = await fetch(url);
    const data = await response.json();
    setLastRoundData(data);
  };

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = 6 - dayOfWeek;
    const nextDrawDate = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    setDrawDate(nextDrawDate);
    const currentRoundNumber = getRoundNumberByDrawDate(nextDrawDate);
    fetchLastRoundData(currentRoundNumber - 1);
  }, []);

  const getCurrentDateAndTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const formattedDay = daysOfWeek[dayOfWeek];

    const formattedDate = `${year}/${month}/${day} (${formattedDay})`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = dayNames[date.getDay()];

    return `${year}/${month}/${day} (${dayOfWeek})`;
  };

  return (
    <div className="App">
      <h1>로또 번호 생성기</h1>
      <div className="lottoWrap">
        <a href="https://dhlottery.co.kr/">
          <span>■ 인터넷구매 https://dhlottery.co.kr ■ 문의안내 1588-6450</span>
        </a>

        <div className="lottoBox">
          <div className="imgArea">
            <img src={lotto} alt="lotto" width="160" height="33" />
            <img src={qrcode} alt="qrcode" width="80" height="80" className="qrcode" />
          </div>

          <div className="dateArea">
            <h2>제 {lastRoundData.drwNo + 1} 회</h2>
            <ul>
              <li>발행일: {getCurrentDateAndTime(currentDateTime)}</li>
              <li>추첨일: {formatDate(drawDate)}</li>
              <li>지급기한: 부자되는 그날까지</li>
            </ul>
          </div>

          <ul className="numberArea">
            {lottoNumbers.map((set, index) => (
              <li key={index}>
                <em key={index}>{indexToLetter(index)} 자 동</em>
                {set.length > 0 ? (
                  set.map((number, idx) => (
                    <span key={idx} style={{ margin: "0 5px" }}>
                      {number}
                    </span>
                  ))
                ) : (
                  <span>&nbsp;</span>
                )}
              </li>
            ))}
          </ul>

          <div className="priceArea">
            금액 <em>￦ 공짜</em>
          </div>
        </div>
      </div>

      <button className="button" onClick={handleClick}>
        번호 생성
      </button>

      <div className="week">
        <h2>지난주 로또 당첨 번호:</h2>
        <div>
          {[...Array(6).keys()].map((i) => (
            <span key={i} style={{ margin: "0 5px" }}>
              {lastRoundData[`drwtNo${i}`]}
            </span>
          ))}
          <span style={{ marginLeft: "10px" }}>보너스 번호: {lastRoundData.bnusNo}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
