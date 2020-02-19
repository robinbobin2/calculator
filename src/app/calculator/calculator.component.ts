import { Room } from "./../room.model";
import { ApiService } from "./../api.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker/ngx-bootstrap-datepicker";
import { timeout } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { User } from "../user.model";

@Component({
  selector: "app-calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"]
})


export class CalculatorComponent implements OnInit {
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  
  minDate: Date;
  
  maxDate = new Date();
  bsRangeValue: any;
  rooms: Room[];
  chosenRoom: Room;
  availability = {} as any;
  colorTheme = "theme-dark-blue";
  periods: any;
  bsConfig: Partial<BsDatepickerConfig>;
  chosenPeriod: any;
  peopleCount = 1;
  showTime = false;
  peopleError = false;
  startDate: any;
  time: any;
  res: any;
  regError = false;
  resErr: string;
  bron: boolean = false;
  modalOpen = false;
  dateChanged = false;
  modalRef: BsModalRef;
  user_id = 0;
  user_verified = false;
  code: number = 0;
  baseUser: any = {} as any;
  loggedIn = false;
  username = "";
  bron_success = false;
  userArray = {} as User;
  registration = {} as {
    name: string;
    surname: string;
    phone: string;
    password: string;
    username?: string;
  };
  constructor(private api: ApiService, private modalService: BsModalService) { this.minDate = new Date(); this.minDate.setDate(this.minDate.getDate());}
  

  ngOnInit() {
    if (localStorage.getItem("token")) {
      this.loggedIn = true;
      this.api.getUserInfo().subscribe(
        res => {
          console.log(res);
          this.userArray = res;
          this.api.getClient(this.userArray.username).subscribe(x => {
            console.log(x);
            this.baseUser = x[0];
            console.log(this.baseUser);
          });
        },
        y => {
          console.log(y);
          this.logout();
        }
      );
    }
    this.bsInlineRangeValue = [this.bsInlineValue];
    this.bsConfig = Object.assign(
      {},
      { containerClass: this.colorTheme, dayDisabled: this.availability }
    );
    this.api.getRooms().subscribe((res: Room[]) => {
      this.rooms = res;
      console.log(this.rooms);
    });
    this.api.getPeriods().subscribe(res => {
      console.log(res);
      this.periods = res;
    });
  }
  onClick(event: any) {
    this.dateChanged = false;

    console.log(event[0]);
    this.startDate = event[0];
    var one_day = 1000 * 60 * 60 * 24;
    let diff: any =
      Math.round(event[0].getTime() - event[1].getTime()) / one_day;
    diff = diff.toFixed(0);
    diff = +diff - diff * 2;
    console.log(diff);
    this.chosenPeriod = this.periods.filter(
      period => period.HourOrDay == 1 && period.Period == diff
    )[0];
    if (this.chosenPeriod) {
      this.showTime = true;
    }
    console.log(this.chosenPeriod);
  }
  chooseRoom(room: Room) {
    this.chosenRoom = room;
    this.api.checkAvailablility(+room.UID).subscribe(res => {
      this.availability = res;
      console.log(this.availability);
      let datesDisabled = [];
      for (let item of this.availability) {
        var date_In = item.Date_In.split(" ");
        var date_Out = item.Date_In.split(" ");
        console.log(date_In);
        console.log(date_Out);
        var dateMove = new Date(date_In[2], 10, date_In[1]);
        var endDate = item.Date_Out;
        var strDate = item.Date_In;
        var dateMove1 = new Date(dateMove.getDate() + 1);
        console.log(dateMove1, endDate, strDate);
        while (strDate < dateMove) {
          console.log(dateMove);

          strDate = dateMove.toISOString().slice(0, 10);
          datesDisabled.push(strDate);
          dateMove.setDate(dateMove.getDate() + 1);
          console.log(dateMove);
        }
        console.log(datesDisabled);
      }
      this.bsConfig = Object.assign(
        {},
        { containerClass: this.colorTheme, datesDisabled: datesDisabled }
      );
    });
  }
  removeRoom() {
    this.chosenRoom = undefined;
    this.availability = {} as any;
  }
  onVerify() {
    this.api.verify(this.code, this.user_id).subscribe(res => {
      console.log(res);
      if (res["message"] == "Successfully verified user!") {
        this.user_verified = true;
        this.api
          .login(this.registration.phone, this.registration.password)
          .subscribe(token => {
            console.log(token);
            this.loggedIn = true;
            localStorage.setItem("token", JSON.stringify(token));
            this.api.getUserInfo().subscribe(
              x => {
                console.log(x);
                this.userArray = x;
              },
              y => {
                console.log(y);
              }
            );
            this.api
              .onReg(
                this.registration.username,
                this.registration.password,
                this.registration.name,
                this.registration.surname,
                this.registration.phone
              )
              .subscribe(
                reg => {},
                err => {
                  setTimeout(() => {
                    this.api
                      .getClient(this.registration.username)
                      .subscribe(x => {
                        console.log(x);
                        this.baseUser = x[0];
                        console.log(this.baseUser);
                        this.api
                          .onLogin(
                            this.registration.username,
                            this.registration.password
                          )
                          .subscribe(
                            h => {
                              this.api
                                .bron(
                                  this.baseUser.UID,
                                  this.startDate,
                                  this.chosenPeriod.UID,
                                  this.chosenRoom.UID,
                                  this.peopleCount
                                )
                                .subscribe(z => {
                                  console.log(z);
                                  if (z == 1) {
                                    this.bron_success = true;
                                    this.loggedIn = false;
                                  }
                                });
                            },
                            e => {
                              this.api
                                .bron(
                                  this.baseUser.UID,
                                  this.startDate,
                                  this.chosenPeriod.UID,
                                  this.chosenRoom.UID,
                                  this.peopleCount
                                )
                                .subscribe(z => {
                                  console.log(z);
                                  if (z == 1) {
                                    this.bron_success = true;
                                    // this.loggedIn = false;
                                  }
                                });
                            }
                          );
                      });
                  }, 2000);
                }
              );
          });
      }
    });
  }
  onIncrease() {
    this.peopleError = false;

    this.peopleCount += 1;
    if (this.peopleCount > +this.chosenRoom.ClientMax) {
      this.peopleCount = +this.chosenRoom.ClientMax;
      this.peopleError = true;
    }
  }
  onDecrease() {
    this.peopleError = false;

    this.peopleCount -= 1;
    if (this.peopleCount < 1) {
      this.peopleCount = 1;
    } else if (this.peopleCount > +this.chosenRoom.ClientMax) {
      this.peopleCount = +this.chosenRoom.ClientMax;
    }
  }
  onBron(template: TemplateRef<any>) {
    // setTimeout(() => {
    //   this.api.getClients().subscribe(log => {
    //     console.log(log);
    //   });
    // }, 2000);
    console.log(this.startDate);

    if (localStorage.getItem("token")) {
      console.log("first case");
      this.modalOpen = true;
      this.modalRef = this.modalService.show(template);
      this.api
        .bron(
          this.baseUser.UID,
          this.startDate,
          this.chosenPeriod.UID,
          this.chosenRoom.UID,
          this.peopleCount
        )
        .subscribe(z => {
          console.log(z);
          if (z == 1) {
            this.bron_success = true;
            this.loggedIn = false;
          }
        });
    } else {
      console.log("second case");
      this.modalOpen = true;
      this.modalRef = this.modalService.show(template);
    }
  }
  onSignup() {
    const regex = RegExp("[A-Za-zА-Яа-я]+", "g");

    if (
      /\d/.test(this.registration.name) ||
      /\d/.test(this.registration.surname)
    ) {
      this.regError = true;
    }

    console.log(/\d/.test(this.registration.surname));
    console.log(this.registration);
    this.registration.username = "internetUser" + Math.floor(Date.now() / 1000);
    this.api.signup(this.registration).subscribe(res => {
      console.log(res["id"]);
      if (res["id"]) {
        this.user_id = res["id"];
      }
    });
  }
  chooseTime(val) {
    this.time = val.target.value;
    console.log(this.startDate);
    let date = new Date(this.startDate);

    console.log(date.getDate(), date.getMonth(), date.getFullYear());
    let month =
      +date.getMonth() + 1 < 10
        ? "0" + (+date.getMonth() + 1)
        : +date.getMonth() + 1;
    this.startDate =
      date.getDate() +
      "." +
      month +
      "." +
      date.getFullYear() +
      " " +
      val.target.value;
    this.dateChanged = true;
    // date = date.getTime();
    // console.log(date / 1000);
    // console.log(this.startDate);
    // let date2: any = Date.parse(this.startDate);
    // console.log(date2);
    // date2 = this.startDate.getTime();
    // console.log(date2);
    // date2 = date2 / 1000;
  }
  logout() {
    localStorage.clear();
    window.location.reload();
  }
  onCount() {
    console.log(this.startDate);
    this.api
      .calculate(
        this.startDate,
        this.chosenPeriod.UID,
        this.chosenRoom.UID,
        this.peopleCount
      )
      .subscribe(
        res => {
          console.log(res);
          if (res["err"]) {
            this.resErr = res["err"];
          } else {
            this.res = res;
            this.bron = true;
          }
        },
        err => {}
      );
  }
}
