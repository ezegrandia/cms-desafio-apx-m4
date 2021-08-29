function main() {
  //hago el fetch a la API de contentful y vinculo la ultima response con la funct dataProcess(apiData)
  fetch(
    "https://cdn.contentful.com/spaces/9eckq975r12y/environments/master/entries?access_token=moNXdOHXyYw91xx7JXsj766e4MeK1k8lpX4-0S-JWa0&content_type=work&order=sys.createdAt"
  )
    .then((response) => response.json())
    .then((data) => dataProcess(data));
}

function dataProcess(apiData) {
  //recibo la data en json de la API y genero el objeto con los parametros
  const itemsArray = apiData.items;
  const imgsArray = apiData.includes.Asset;

  console.log(apiData, "soy apiData");

  //creo el objeto para ir iterando y obteniendo los params a pasar
  const objParams = {
    title: "",
    description: "",
    img: "",
    url: "",
  };

  // Creo un objeto para ir iterando y obteniendo la id de la imagen correcta
  const itemImgId = {
    item: 0,
    id: "",
  };

  //por cada item del array remplazo la info del objeto con la de la API y se lo mando a la funct addWorkCard(params)
  itemsArray.forEach((item, i) => {
    objParams.title = item.fields.titulo;
    objParams.description = item.fields.descripcion;
    objParams.url = item.fields.url;

    itemImgId.item = i;
    itemImgId.id = item.fields.imagen.sys.id;

    imgsArray.forEach((img) => {
      if (itemImgId.id == img.sys.id) {
        objParams.img = img.fields.file.url;
      }
    });

    addWorkCard(objParams);
  });
}

function addWorkCard(params = {}) {
  //recibo el objeto  con los params, modifico el DOM y clono el template para que se renderize
  const containerTemplateEl = document.querySelector(".card-container");
  const cardTemplateEl = document.getElementById("portfolio-card-template");

  cardTemplateEl.content.querySelector(".card-title").textContent =
    params.title;
  cardTemplateEl.content.querySelector(".card-description").textContent =
    params.description;
  cardTemplateEl.content.querySelector(".card-img").src = params.img;
  cardTemplateEl.content.querySelector(".card-url").href = params.url;

  const clone = document.importNode(cardTemplateEl.content, true);
  containerTemplateEl.appendChild(clone);
}

main();
