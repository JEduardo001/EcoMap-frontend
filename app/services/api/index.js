const apiUrl = "http://192.168.1.9:3000"

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