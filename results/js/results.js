let count = Cookies.get("count");
if (count == undefined) {
  count = 0;
}
count++;
console.log(count);
document.getElementById("count").innerText = count;
Cookies.set("count", count, { sameSite: "strict" });
