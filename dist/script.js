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
    if(isValid(contact)){
      $state.html(contact.serie + ' - ' + contact.number + ' - ' + contact.type);
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

/**
 * 
 * @param {Contact} contact 
 */
function isValid(contact) {
  contact.number = contact.number.replace(/[- ]/g, ''); // Retrait des espaces et des tirets du numéro de téléphone

  let maskNumb8 = /^\d{8,8}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;
  let maskNumb12 = /^\+\d{11,11}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;
  let maskNumb13 = /^\d{13,13}$/; // Masque pour déterminer si nous n'avons que 8 caractères qui ne sont que des chiffres;

  let maskFixNumber = /^(2|3)/; // Masque pour les numéros fixes

  if (maskNumb8.test(contact.number)) {
    contact.serie = 1;
    if(maskFixNumber.test(contact.number)){
      contact.type = "fixe";
    } else {
      contact.type = "mobile";
    }
    return true;
  } else if (maskNumb12.test(contact.number) && contact.number.startsWith('+225')) {
    contact.serie = 2;
    checkNumber = contact.number.substr(4);
    if(maskFixNumber.test(checkNumber)){
      contact.type = "fixe";
    } else {
      contact.type = "mobile";
    }
    return true;
  } else if (maskNumb13.test(contact.number) && contact.number.startsWith('00225')) {
    contact.serie = 3
    checkNumber = contact.number.substr(5);
    if(maskFixNumber.test(checkNumber)){
      contact.type = "fixe";
    } else {
      contact.type = "mobile";
    }
    return true;
  } else {
    return false
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
