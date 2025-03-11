const urls = {
    // BASE_URL: "http://10.0.2.2:5298/api", //For android emulator 
    // BASE_URL: "http://192.168.20.67:5298/api", //For android device
    BASE_URL: "http://192.168.20.41:8080/api", //For android device
    
    MICROCHIP: {
      GetHorseByMicrochipNumber: (microchipNumber) => `${urls.BASE_URL}/Microchip/${microchipNumber}`,
      SaveHorseLocation: () => `${urls.BASE_URL}/Microchip/SaveHorseLocation`,
    },

  };

  export default urls;