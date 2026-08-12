const router = async (page) => {
    const response = await fetch(`views/${page}`);
    const html = await response.text();

    $("#app").html(html);

    document.dispatchEvent(new Event("pageRendered"));
};

export {router}