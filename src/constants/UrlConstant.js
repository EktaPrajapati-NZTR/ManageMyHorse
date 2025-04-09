const urls = {
    // BASE_URL: "http://10.0.2.2:5298/api/", //Android emulator 
    // BASE_URL: "http://192.168.20.52:8080/api/", // Locally hosted
    // BASE_URL: "http://192.168.20.52:5298/api/", // Local
    // BASE_URL: "https://lovetracingstage.nzracing.co.nz/api/", //Staging
    BASE_URL: "https://idmytbapi.nzracing.co.nz/api/", //Production
    
    MICROCHIP: {
      GetHorseByMicrochipNumber: (microchipNumber) => `${urls.BASE_URL}Microchip/${microchipNumber}`,
      SaveHorseLocation: () => `${urls.BASE_URL}Microchip/SaveHorseLocation`,
    },

  };

  export default urls;