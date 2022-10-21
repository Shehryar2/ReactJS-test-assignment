import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getLogs, getUsers } from "./Api";
import "./App.css";

function App() {
  setTimeout(() => {
    var colors = [
      "#e57373",
      "#ba68c8",
      "#90caf9",
      "#4db6ac",
      "#dce775",
      "#ffb74d",
      "#b0bec5",
      "#81c784",
      "#000000a7"
    ];
    var customizeContainer = Array.from(document.querySelectorAll("#avatar"));
    customizeContainer.forEach(function (node, i) {
      node.style.backgroundColor = colors[i % colors.length];
    });
  }, 0);

  const [usersData, setUsersData] = useState([]);
  const getData = () => {
    var userData = [];
    getUsers()
      .then((users) => {
        getLogs()
          .then((logs) => {
            users.forEach((user) => {
              user.impressions = [];
              user.conversions = [];
              user.impressionsRevenue = [];
              user.conversionsRevenue = [];
              user.sumRevenue = 0;
              logs.forEach((log) => {
                if (user.id === log.user_id) {
                  if (log.type === "impression") {
                    user.impressions.push(log);
                    user.impressionsRevenue.push(log.revenue);
                  }
                  if (log.type === "conversion") {
                    user.conversions.push(log);
                    user.conversionsRevenue.push(log.revenue);
                  }
                  user.sumRevenue += log.revenue;
                }
              });
              userData.push(user);
            });
            setUsersData(userData);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container my-5 py-5">
      <div className="row">
        {usersData &&
          usersData.map((user, index) => {
            var intials;
            var fullName = user.name;
            intials = fullName
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase();
            return (
              <div className="col-md-4 single__user" key={index}>
                <div className="card mb-3 p-4" style={{ maxWidth: "540px" }}>
                  <div className="d-flex align-items-center">
                    <div id="avatar">{intials[0]}</div>
                    <div className="mx-3">
                      <h4 className="card-title mb-0">{user.name}</h4>
                      <p
                        className="card-text text-muted"
                        style={{ fontWeight: "500" }}
                      >
                        {user.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="row no-gutters mt-3">
                    <div className="col-md-7 " style={{ marginTop: "-10px" }}>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          chart: {
                            height: 100,
                            type: "line",
                          },
                          title: false,
                          xAxis: {
                            enabled: false,
                            title: false,
                            label: false,
                            gridLineWidth: false,
                            categories: false,
                            tickInterval: 0,
                            labels: {
                              enabled: false,
                            },
                          },
                          legend: {
                            enabled: false,
                          },
                          tooltip: {
                            enabled: false,
                          },
                          yAxis: {
                            title: false,
                            label: false,
                            gridLineWidth: false,
                            categories: false,
                            tickInterval: false,
                            labels: {
                              enabled: false,
                            },
                          },
                          credits: {
                            enabled: false,
                          },
                          series: [
                            {
                              data: user.conversionsRevenue.slice(0, 20),
                              allowPointSelect: false,
                              name: "",
                              type: "line",
                              color: "#000000b9",
                              marker: {
                                enabled: false,
                                states: {
                                  hover: {
                                    enabled: false,
                                  },
                                },
                              },
                            },
                          ],
                        }}
                      />
                      <p className="mb-0 text-center text-muted">
                        Conversions (0 - 50)
                      </p>
                    </div>
                    <div className="col-md-5">
                      <div className="">
                        <h5 className="mb-0 impression">
                          {(user?.impressions.length)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </h5>
                        <p className="mb-0 text-muted">Impression</p>
                        <h5 className="mb-0 conversions">
                          {(user?.conversions.length)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </h5>
                        <p className="mb-0 text-muted">Conversion</p>
                        <h5 className="mb-0 revenue">
                          $
                          {Math.round(user?.sumRevenue)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
