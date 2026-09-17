async function loadCartoonCover() {
  const img = document.getElementById("cartoon-cover-img");
  if (!img) return;

  const fallback = () => {
    img.src = "/media/cartoon-poster";
  };

  try {
    const chunks = await Promise.all(
      Array.from({ length: 6 }, (_, index) =>
        fetch(`/cover-chunk-${index}.txt?v=1`, { cache: "no-store" }).then((response) => {
          if (!response.ok) throw new Error(`cover chunk ${index}: ${response.status}`);
          return response.text();
        })
      )
    );

    const base64 = chunks.join("").replace(/\s+/g, "");
    if (base64.length !== 31580) throw new Error(`cover length ${base64.length}`);

    const binary = atob(base64);
    const last = binary.length - 1;
    const validJpeg =
      binary.length === 23683 &&
      binary.charCodeAt(0) === 0xff &&
      binary.charCodeAt(1) === 0xd8 &&
      binary.charCodeAt(last - 1) === 0xff &&
      binary.charCodeAt(last) === 0xd9;

    if (!validJpeg) throw new Error("cover JPEG validation failed");

    img.addEventListener("error", fallback, { once: true });
    img.src = `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Cartoon cover load failed:", error);
    fallback();
  }
}

loadCartoonCover();
