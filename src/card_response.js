export async function postData(apiURL, opinion) {
  const response = await fetch(apiURL, {
    method: "POST",
    mode: "cors",
    caches: "no-cache",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(opinion)
  });

  if (response.ok) {
    let json = await response.json();
    console.log(json);
    return json["Result"];
  } else {
    alert("HTTP-Error: " + response.status);
  }
}
