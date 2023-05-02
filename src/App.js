import React, { useState, useEffect, useCallback, useMemo } from "react";
import { generateLottoNumbers } from "./utils";
import "./App.scss";
import qrcode from "./images/qrcode.png";
import lotto from "./images/lotto.png";

function App() {
  // 로또 번호를 저장
  const [lottoNumbers, setLottoNumbers] = useState(Array.from({ length: 5 }, () => []));
  // 마지막 회차 데이터를 저장
  const [lastRoundData, setLastRoundData] = useState({ drwtNos: [], bnusNo: null });
  // 추첨일을 저장
  const [drawDate, setDrawDate] = useState(new Date());
  // 현재 날짜 및 시간을 저장
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // 1초마다 현재 날짜 및 시간을 업데이트 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // 번호 생성 버튼 클릭 시 새로운 로또 번호를 생성하는 함수
  const handleClick = useCallback(() => {
    const newLottoNumbers = generateLottoNumbers(5);
    setLottoNumbers(newLottoNumbers);
  }, []);
  // 회차 데이터를 가져오는 함수
  const fetchLastRoundData = useCallback(async (round) => {
    const url = `http://localhost:5000/api?method=getLottoNumber&drwNo=${round}`;
    const headers = { "X-Requested-With": "xhr" };
    const response = await fetch(url, { headers });
    const data = await response.json();
    const drwtNos = [...Array(6).keys()].map((i) => data[`drwtNo${i + 1}`]);
    setLastRoundData({ drwtNos, bnusNo: data.bnusNo, drwNo: data.drwNo });
  }, []);
  // 추첨일로부터 회차 번호를 구하는 함수
  const getRoundNumberByDrawDate = (drawDate) => {
    const referenceDate = new Date(2002, 11, 7);
    const timeDifference = drawDate - referenceDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const weeksDifference = Math.round(daysDifference / 7);
    return weeksDifference + 1;
  };
  // 지급 기한을 구하는 함수
  const getPaymentDeadline = (drawDate) => {
    const deadlineDate = new Date(drawDate);
    deadlineDate.setDate(deadlineDate.getDate() + 365);
    return deadlineDate;
  };
  // 다음 추첨일과 마지막 회차 데이터를 가져오는 useEffect
  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = 6 - dayOfWeek;
    const nextDrawDate = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    setDrawDate(nextDrawDate);
    const currentRoundNumber = getRoundNumberByDrawDate(nextDrawDate);
    fetchLastRoundData(currentRoundNumber - 1);
  }, [fetchLastRoundData]);

  // 날짜를 포맷팅하는 함수를 메모이제이션하여 반환하는 useMemo
  const formatDate = useMemo(() => {
    // includeTime이 true인 경우 시간까지 포함하여 포맷팅하고, false인 경우 날짜만 포맷팅함
    return (date, includeTime = false) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      const dayOfWeek = dayNames[date.getDay()];
      // 시간을 포함할지 여부에 따라 포맷팅된 날짜 문자열을 반환
      return includeTime
        ? `${year}/${month}/${day} (${dayOfWeek}) ${hours}:${minutes}:${seconds}`
        : `${year}/${month}/${day} (${dayOfWeek})`;
    };
  }, []);

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
              <li>발행일: {formatDate(currentDateTime, true)}</li>
              <li>추첨일: {formatDate(drawDate)}</li>
              <li>지급기한: {formatDate(getPaymentDeadline(drawDate))}</li>
            </ul>
          </div>
          <ul className="numberArea">
            {lottoNumbers.map((set, index) => (
              <li key={index}>
                <em key={index}>{String.fromCharCode(65 + index)} 자 동</em>
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
          {lastRoundData.drwtNos.map((number, i) => (
            <span key={i} style={{ margin: "0 5px" }}>
              {number}
            </span>
          ))}
          <span style={{ marginLeft: "10px" }}>보너스 번호: {lastRoundData.bnusNo}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
