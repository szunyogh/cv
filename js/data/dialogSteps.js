// A dialógus lépései (szövegek). Új lépés felvételéhez elég ide beszúrni egy objektumot.
//
// Mezők:
//   title, text  – megjelenő szöveg
//   yes, no      – gombfeliratok (a "yes" mindig a levélküldést indítja)
//   dodge        – hányszor ugorjon el az egér elől a "no" gomb (opcionális, csak desktopon)
//   close        – ha meg van adva, ez az utolsó lépés egyetlen "Bezár" gombbal

export const DIALOG_STEPS = [
  {
    title: 'Hú, tényleg legörgettél idáig? 🎉',
    text: 'Örülök, hogy végigolvastad a CV-met! Akarsz nekem munkát adni?',
    yes: 'Igen, jöhetsz! 💼',
    no: 'Nem, kösz'
  },
  {
    title: 'Naaa, kérlek! 🥺',
    text: 'Tudok Fluttert, és még a spagettikódot is rendbe teszem. Nagyon jó fej vagyok, ígérem!',
    yes: 'Jó, meggyőztél',
    no: 'Akkor is nem'
  },
  {
    title: 'Hozok kávét is! ☕',
    text: 'Meg saját széket, és nem eszem meg a hűtőből más kajáját. Csak az enyémet.',
    yes: 'Na jó, ez már komoly ajánlat',
    no: 'Még mindig nem'
  },
  {
    title: 'Nem lesz bug. 🐛',
    text: 'Jó, ez nem igaz, de legalább gyorsan kijavítom őket. És commitolok is, nem csak nézem.',
    yes: 'Felveszlek, na!',
    no: 'Hajthatatlan vagyok'
  },
  {
    title: 'Utolsó esély... 🙏',
    text: 'Térdre ereszkedek a Flutter widget fa előtt. Egyetlen setState, és minden jobb lehet!',
    yes: 'Jó, nyertél, felveszlek!',
    no: 'Mégis nem',
    dodge: 3
  },
  {
    title: 'Jó, akkor mindegy, hagyjuk... 😢',
    text: 'Köszi, hogy legalább végigolvastad. Jó napot!',
    close: 'Bezár'
  }
];
