import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient) {}
  getRooms() {
    return this.http.get("https://sauna24ufa.ru/calc.php?rooms");
  }
  getUserInfo() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("token"))["access_token"]
    });
    console.log(JSON.parse(localStorage.getItem("token"))["access_token"]);
    return this.http.get<User>("https://api.sauna24ufa.ru/api/auth/user", {
      headers: headers
    });
  }
  checkAvailablility(id: number) {
    return this.http.get("https://sauna24ufa.ru/calc.php?available=" + id);
  }
  signup(reg: { name; surname; phone; password; username? }) {
    return this.http.post("https://api.sauna24ufa.ru/api/auth/signup", {
      name: reg.name,
      surname: reg.surname,
      phone: reg.phone,
      password: reg.password,
      username: reg.username
    });
  }
  getPeriods() {
    return this.http.get("https://sauna24ufa.ru/calc.php?periods");
  }
  onReg(login, password, name1, name2, phone) {
    return this.http.get(
      "https://sauna24ufa.ru/calc.php?reg&login=" +
        login +
        "&password=" +
        password +
        "&name1=" +
        name1 +
        "&name2=" +
        name2 +
        "&phone=" +
        phone
    );
  }
  onLogin(login, password) {
    return this.http.get(
      "https://sauna24ufa.ru/calc.php?login&login=" +
        login +
        "&password=" +
        password
    );
  }
  getClients() {
    return this.http.get("https://sauna24ufa.ru/calc.php?users");
  }
  getClient(login) {
    return this.http.get(
      "https://sauna24ufa.ru/calc.php?get_user&username=" + login
    );
  }
  verify(code: number, id: number) {
    return this.http.post("https://api.sauna24ufa.ru/api/auth/verify", {
      code: code,
      id: id
    });
  }
  login(phone: string, password: string) {
    return this.http.post("https://api.sauna24ufa.ru/api/auth/login", {
      phone: phone,
      password: password
    });
  }
  calculate(date: any, hours: any, room: any, client: any) {
    // date = new Date(date);
    // date = date.getTime();
    // date = date / 1000;
    console.log(date, hours, room, client);
    return this.http.get(
      "https://vookie.ru/tests.php?calc&date=" +
        date +
        "&hours=" +
        hours +
        "&room=" +
        room +
        "&client=" +
        client
    );
  }
  bron(uid: any, date: any, hours: any, room: any, client: any) {
    // date = new Date(date);
    // date = date.getTime();
    // date = date / 1000;
    console.log(date, hours, room, client);
    return this.http.get(
      "https://vookie.ru/tests.php?start_bron&uid=" +
        uid +
        "&date=" +
        date +
        "&hours=" +
        hours +
        "&room=" +
        room +
        "&client=" +
        client
    );
  }
  getResult() {
    return this.http.get("https://sauna24ufa.ru/calc.php");
  }
}
