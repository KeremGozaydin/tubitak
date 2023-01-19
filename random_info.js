const RandExp = require('randexp');

let randexp = (a) => {
    return new RandExp(a).gen()
}

// random phone numbers

let RandTelNo = () => {
    return `+90 5${randexp(/[0-5][0-9]/)} ${randexp(/\d{3}/)} ${randexp(/\d{4}/)}`
}

// random tc

let RandTCNo = () => {
    let int = randexp(/[1-9]\d{8}/)
    let charArr = int.split('').map(a => parseInt(a));
    let tenth = (7 * charArr.map((b,a) => a % 2 == 1 ? b : 0)
                           .reduce((a,b) => a + b,0) 
                    -
                    charArr.map((b,a) => a % 2 == 0 ? b : 0)
                           .reduce((a,b) => a+b,0))
                    % 10
    let eleventh = (charArr.reduce((a,b) => a+b,0) + tenth) % 10
    return `${int}${tenth}${eleventh}`
}

// random isim

let RandFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

let erkekler = ['Emir', 'Yağız', 'Ege', 'Çağan ', 'Sarp ', 'Kerem ', 'Deniz ', 'Kağan ', 'Mert ', 'Görkem', 'Burak', 'Meriç', 'Berke', 'Efe ', 'Doruk', 'Bartu', 'Emirhan', 'Alp', 'Cem', 'Yiğit', 'Emre', 'Kutay ', 'Tuna', 'Baran', 'Arhan', 'Canberk ', 'Dağhan', 'Bora ', 'Rüzgâr ', 'Derin', 'Toprak', 'Arın', 'Aşkın', 'Çınar', 'Koray ', 'Barlas', 'Ada', 'Atakan', 'Berk ', 'Polat', 'Serhan', 'Utku', 'Berkay', 'Onur', 'Çağlar', 'Can', 'Tuğra', 'Şah', 'Göktürk ', 'Ali']
erkekler = erkekler.map(a => a.trim())

let kadinlar = ['Talya ', 'Zeynep ', 'Ela', 'Duru', 'Yaren', 'Ceren', 'Ece', 'Melis', 'Naz', 'Su', 'Berra', 'Ecem', 'Sena', 'İrem', 'Alara', 'Azra', 'Dilay', 'İdil', 'Eylül', 'İpek', 'Yağmur', 'Lara', 'Derin', 'Ilgın', 'Havin', 'Nilsu', 'Kayra', 'İlkin', 'Tuana', 'Beril', 'İlgi', 'Simay', 'Mira', 'Beren', 'Pelin', 'Yazmira', 'Bade', 'Selin', 'Simge', 'Rana', 'Şimal', 'Damla', 'Melike', 'Pınar', 'Başak', 'İlayda', 'Minel', 'Alara', 'Arzum', 'Aleyna']
kadinlar = kadinlar.map(a => a.trim())

let RandErkekIsim = () => {
    return RandFromArray(erkekler)
}

let RandKadinIsim = () => {
    return RandFromArray(kadinlar)
}

// random soyad

let soyadlar = ['Yılmaz', ' Kaya', ' Demir', ' Çelik', ' Şahin', ' Yıldız', ' Yıldırım', ' Öztürk', ' Aydın', ' Özdemir', ' Arslan', ' Doğan', ' Kılıç', ' Aslan', ' Çetin', ' Kara', ' Koç', ' Kurt', ' Özkan', ' Şimşek', ' Polat', ' Özcan', ' Korkmaz', ' Çakır', ' Erdoğan'].map(a => a.trim())

let RandSoyad = () => {
    return RandFromArray(soyadlar)
}

// random tarih

let RandTarih = () => {
    return new Date(new Date(2010,0,1).getTime() + Math.random() * (new Date().getTime() - new Date(2010,0,1).getTime())).toISOString().split('T')[0]
}

let RandDg = () => {
    return new Date(new Date(1960,0,1).getTime() + Math.random() * (new Date(2005,0,1).getTime() - new Date(1960,0,1).getTime())).toISOString().split('T')[0]
}

let RandBolum = () => {
    return RandFromArray(['radyoloji', 'dermatoloji', 'pediatri', 'dahiliye', 'gastroentoloji', 'kardiyoloji'])
}

module.exports = {RandErkekIsim,RandKadinIsim,RandTelNo,RandTCNo,RandTarih,RandSoyad,RandDg,RandBolum,RandFromArray}