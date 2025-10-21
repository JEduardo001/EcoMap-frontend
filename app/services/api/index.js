const apiUrl = "http://192.168.20.119:3000"

export const fetchMarkers = async () => {
    try{

        const response = await fetch(apiUrl + "/markers/getMarkers", {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        return data
    }catch(error){
        console.error("Error fetching markers:", error);
    }
}

export const fetchMarkersByFilter = async (filterId) => {
    try{
        const response = await fetch(apiUrl + "/markers/getMarkersByFilter/" + filterId, {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        return data
    }catch(error){
        console.error("Error fetching markers by filter:", error);
    }
}

export const fetchSpecies = async () => {
    try{

        const response = await fetch(apiUrl + "/species/getSpecies", {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        return data
    }catch(error){
        console.error("Error fetching species:", error);
    }
}

export const fetchSpeciesByFilter = async (filterId) => {
    try{
        const response = await fetch(apiUrl + "/species/getSpeciesByFilter/" + filterId, {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json()
        return data
    }catch(error){
        console.error("Error fetching species by filter:", error);
    }
}



export const submitImage = async (imageUri) => {
  try {
    const formData = new FormData();
    const responseBlob = await fetch(imageUri);
    const blob = await responseBlob.blob();
    const imageName = `animal_${Date.now()}.jpg`;

    formData.append("file", {
      uri: imageUri,
      type: blob.type,
      name: imageName
    });

    const response = await fetch(apiUrl + "/storage/submitImage", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submit new image:", error);
  }
};


export const submitNewMarket = async (dataMarket) => {
  try {
    const formData = new FormData();

    // Agregar campos de texto
    formData.append('name', dataMarket.name);
    formData.append('description', dataMarket.description);
    formData.append('category', dataMarket.category);
    formData.append('latitude', String(dataMarket.latitude));
    formData.append('longitude', String(dataMarket.longitude));

    // Agregar imagen
    const image = dataMarket.imageObject;
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'photo.jpg',
      type: image.type || 'image/jpeg',
    });

    const response = await fetch(apiUrl + "/markers/createMarket", {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("Error submit new market:", error);
    return { status: 500, error: error.message };
  }
};
