const urls = {
    // BASE_URL: "http://10.0.2.2:5298/api/", //For android emulator 
    // BASE_URL: "http://192.168.20.43:8080/api/", //For android device
    // BASE_URL: "https://lovetracingstage.nzracing.co.nz/api/", //Staging
    BASE_URL: "https://idmytbapi.nzracing.co.nz/api/", //Production-Using staging web api, TST database.
    
    MICROCHIP: {
      GetHorseByMicrochipNumber: (microchipNumber) => `${urls.BASE_URL}Microchip/${microchipNumber}`,
      SaveHorseLocation: () => `${urls.BASE_URL}Microchip/SaveHorseLocation`,
    },

  };

  export default urls;