exports.handler = async (event) => {
  // 예시: 점수 저장 로직
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Score saved!" }),
  };
};
