async function run() {
  const query = new URLSearchParams({
    page: "1",
    limit: "30",
  });

  const res = await fetch(`https://api.kajj8808.com/catalog/series?${query.toString()}`);
  const data = await res.json();
  
  console.log("Total series with limit 30:", data.data.total);
}
run();
