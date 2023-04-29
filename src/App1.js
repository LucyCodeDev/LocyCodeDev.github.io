import React, { useState } from "react";
import { generateLottoNumbers } from "./utils";

function App() {
  const [lottoNumbers, setLottoNumbers] = useState([]);


  const handleClick = () => {
    const newLottoNumbers = generateLottoNumbers();
    setLottoNumbers(newLottoNumbers);
  };

  const referenceDate = new Date(2023, 3, 22); // 2023년 4월 22일 (월은 0부터 시작하기 때문에 3으로 설정)
  const referenceRound = 1064;

  const today = new Date();
  const timeDifference = today - referenceDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  const weeksDifference = Math.ceil(daysDifference / 7);
  const currentRound = referenceRound + weeksDifference;

  return (
    <div className="App">
      <h1>로또 번호 생성기</h1>
      <h2>이번주 로또 회차: {currentRound ? currentRound : "불러오는 중..."}</h2>
      <button onClick={handleClick}>번호 생성</button>
      <div>
      {lottoNumbers.map((number, index) => (
        <span key={index} style={{ margin: "0 5px" }}>
          {number}
        </span>
      ))}
      </div>
    </div>
  );
}

export default App;
