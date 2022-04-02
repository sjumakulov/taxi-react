import React from "react";

function History({ paymentHistory, handleClick }) {
  return (
    <div className="history-wrap-div">
      <div className="history-top-div">
        <div className="table">
          {Object.keys(paymentHistory)
            .map((month, index) => {
              let monthName = new Date(
                new Date().getFullYear(),
                parseInt(month),
                0
              ).toLocaleString("En", { month: "long" });

              let thisMonthHistory = paymentHistory[month],
                putyovkaGiven = thisMonthHistory.putyovka_given,
                historyArray = thisMonthHistory.history,
                transactions = historyArray.map((transaction, index2) => {
                  return (
                    <div className="transaction" key={index2}>
                      <div className="transaction-top">
                        <h6>{transaction.payment_date}</h6>
                      </div>
                      <div className="transaction-bottom">
                        <div>
                          <p>Cash: {transaction.cash}</p>
                        </div>
                        <div>
                          <p>Card: {transaction.card}</p>
                        </div>
                      </div>
                    </div>
                  );
                });

              return (
                <div className="month" key={index}>
                  <div className="right-align">
                    <h5>{monthName}</h5>
                    <p>{putyovkaGiven && "Permission given"}</p>
                  </div>
                  {transactions.reverse()}
                </div>
              );
            })
            .reverse()}
        </div>
      </div>
      <div className="history-bottom-div right-align">
        <button
          onClick={handleClick}
          name="back"
          className="btn btn-outline-primary btn-sm"
          style={{border: "none"}}
        >
          <i className="fas fa-chevron-double-left"></i>
        </button>
      </div>
    </div>
  );
}

export default History;
