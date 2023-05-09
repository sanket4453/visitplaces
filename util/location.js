const API_KEY = '';

 async function getCoordinate (address) {
    return {
        lat : 40.7884474,
        lng: -73.9871516
    }
    // const responce = await axios.get(
    //     `https://,aps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    // )

    // const data = responce.data;

    // if(!data || data.status === 'ZERO_RESULTS'){
    //     return res.status(422)
    //             .json({message:"No found coordinated"})

            
    // }
    // const coordinates = data.results[0].geometry.location;
    // return coordinates;
}

module.exports = getCoordinate;
