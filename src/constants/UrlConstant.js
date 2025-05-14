const urls = {
    // BASE_URL: "http://10.0.2.2:5298/api/", //Android emulator 
    // BASE_URL: "http://192.168.20.52:8080/api/", // Locally hosted
    // BASE_URL: "http://192.168.20.52:5298/api/", // Local
    BASE_URL: "https://lovetracingstage.nzracing.co.nz/api/", //Staging
    // BASE_URL: "https://idmytbapi.nzracing.co.nz/api/", //Production,
    LOGIN_URL: "https://appservice.nzracing.co.nz/1.2.0/",
    
    MICROCHIP: {
      GetHorseByMicrochipNumber: (microchipNumber) => `${urls.BASE_URL}Microchip/by-microchip/${microchipNumber}`,
      SaveHorseLocation: () => `${urls.BASE_URL}Microchip/SaveHorseLocation`,
      GetScannedHorsesByContactID: (contactID) => `${urls.BASE_URL}Microchip/by-contact/${contactID}`,
    },

    LOGIN:{
      Login: () => `${urls.LOGIN_URL}Settings/Login`,
      Logout: () => `${urls.LOGIN_URL}Settings/Logout`,
      VerifyAuthentication: () => `${urls.LOGIN_URL}Settings/VerifyAuthentication`,
    }

  };

  export default urls;