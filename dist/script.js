var working = false;
$('.login').on('submit', function (e) {
  e.preventDefault();
  var phone = $('#phoneNumber').val();
  contact = new Contact(phone);
  if (working) return;
  working = true;
  var $this = $(this),
    $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Vérification');
  setTimeout(function () {
    if (phoneChanger(contact)) {
      $state.html(contact.number + ' - ' + contact.carrier);
      $this.addClass('ok');
      setTimeout(function () {
        $state.html('Migrer');
        $this.removeClass('ok loading');
        working = false;
      }, 4000);
    } else {
      $state.html('Numéro non-valide');
      $this.addClass('nok');
      setTimeout(function () {
        $state.html('Migrer');
        $this.removeClass('nok loading');
        working = false;
      }, 4000);
    }
  }, 3000);
  console.log(contact);
});

class Contact {
  constructor(number) {
    this.number = number;
    this.carrier = "";
    this.type = "";
    this.serie = "";
    this.newNumber = "";
  }
}

let maskNumb8 = /^\d{8,8}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;
let maskNumb12 = /^\+\d{11,11}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;
let maskNumb13 = /^\d{13,13}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;
let maskFixNumber = /^(2|3)/; // Masque pour les numéros fixes

/**
 * Vérifie si le contact saisi est valide
 * @param {Contact} contact 
 */
function isValid(contact) {
  contact.number = contact.number.replace(/[- ]/g, ''); // Retrait des espaces et des tirets du numéro de téléphone

  if (maskNumb8.test(contact.number)) {
    contact.serie = 1;
    setType(contact);
    return true;
  } else if (maskNumb12.test(contact.number) && contact.number.startsWith('+225')) {
    contact.serie = 2;
    checkNumber = contact.number.substr(4);
    setType(contact);
    return true;
  } else if (maskNumb13.test(contact.number) && contact.number.startsWith('00225')) {
    contact.serie = 3
    checkNumber = contact.number.substr(5);
    setType(contact);
    return true;
  } else {
    return false
  }
}

/**
 * Ajoute le type du contact
 * @param {Contact} phone 
 */
function setType(phone) {
  if (maskFixNumber.test(phone.number)) {
    phone.type = "fixe";
  } else {
    phone.type = "mobile";
  }
}

/**
 * Retourne l'opérateur téléphonique
 * @param {Contact} phone le contact téléphonique
 */
function setCarrier(phone) {
  prefix = getPrefix(phone);
  if (jQuery.inArray(prefix, carriersPrefix.ORANGE.mobile) != -1 || jQuery.inArray(prefix, carriersPrefix.ORANGE.fixe) != -1) {
    phone.carrier = "ORANGE";
  }
  if (jQuery.inArray(prefix, carriersPrefix.MTN.mobile) != -1 || jQuery.inArray(prefix, carriersPrefix.MTN.fixe) != -1) {
    phone.carrier = "MTN";
  }
  if (jQuery.inArray(prefix, carriersPrefix.MOOV.mobile) != -1 || jQuery.inArray(prefix, carriersPrefix.MOOV.fixe) != -1) {
    phone.carrier = "MOOV";
  }
}

/**
 * Retourne le préfix du téléphone
 * @param {Contact} phone le contact téléphonique
 */
function getPrefix(phone) {
  if (phone.type == 'mobile') {
    switch (phone.serie) {
      case 1:
        return phone.number.substr(0, 2);
        break;

      case 2:
        return phone.number.substr(4, 2);
        break;

      case 3:
        return phone.number.substr(5, 2);
        break;

      default:
        break;
    }
  }
  if (phone.type == 'fixe') {
    switch (phone.serie) {
      case 1:
        return phone.number.substr(0, 3);
        break;

      case 2:
        return phone.number.substr(4, 3);
        break;

      case 3:
        return phone.number.substr(5, 3);
        break;

      default:
        return false;
        break;
    }
  }

  return prefix;
}

function phoneChanger(phone) {
  if (isValid(phone)) {
    setCarrier(phone);
    migrate(phone);
    return true;
  } else {
    return false;
  }
}

/**
 * Réalise la migration du contact
 * @param {Contact} phone 
 */
function migrate(phone) {
  switch (phone.carrier) {
    case 'ORANGE':
      if(phone.serie == 1) {
        if(phone.type == 'fixe') {
          phone.number = '27' + phone.number;
        } else if(phone.type == 'mobile') {
          phone.number = '07' + phone.number;
        }
      } else if(phone.serie == 2) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(4)
          phone.number = '+22527' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(4)
          phone.number = '+22507' + number;
        }
      } else if(phone.serie == 3) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(5)
          phone.number = '0022527' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(5)
          phone.number = '0022507' + number;
        }
      }
      break;

    case 'MTN':
      if(phone.serie == 1) {
        if(phone.type == 'fixe') {
          phone.number = '25' + phone.number;
        } else if(phone.type == 'mobile') {
          phone.number = '05' + phone.number;
        }
      } else if(phone.serie == 2) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(4)
          phone.number = '+22525' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(4)
          phone.number = '+22505' + number;
        }
      } else if(phone.serie == 3) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(5)
          phone.number = '0022525' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(5)
          phone.number = '0022505' + number;
        }
      }
      break;

    case 'MOOV':
      if(phone.serie == 1) {
        if(phone.type == 'fixe') {
          phone.number = '21' + phone.number;
        } else if(phone.type == 'mobile') {
          phone.number = '01' + phone.number;
        }
      } else if(phone.serie == 2) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(4)
          phone.number = '+22521' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(4)
          phone.number = '+22501' + number;
        }
      } else if(phone.serie == 3) {
        if(phone.type == 'fixe') {
          number = phone.number.substr(5)
          phone.number = '0022521' + number;
        } else if(phone.type == 'mobile') {
          number = phone.number.substr(5)
          phone.number = '0022501' + number;
        }
      }
      break;
  
    default:
      break;
  }
}


let carriersPrefix = {
  "ORANGE": {
    "mobile": [
      "07", "08", "09", "47", "48", "49", "57", "58", "58", "67", "68", "69", "77", "78", "79", "87", "88", "89", "97", "98"
    ],
    "fixe": [
      "202", "203", "212", "213", "215", "217", "224", "225", "234", "235", "243", "244", "245", "306", "316", "319", "327", "337", "347", "359", "368"
    ]
  },
  "MTN": {
    "mobile": [
      "04", "05", "06", "44", "45", "46", "54", "55", "56", "64", "65", "66", "74", "75", "76", "84", "85", "86", "94", "95", "96"
    ],
    "fixe": [
      "200", "210", "220", "230", "240", "300", "310", "320", "330", "340", "350", "360"
    ]
  },
  "MOOV": {
    "mobile": [
      "01", "02", "03", "40", "41", "42", "43", "50", "51", "52", "53", "70", "71", "72", "73"
    ],
    "fixe": [
      "208", "218", "228", "238"
    ]
  }
}
