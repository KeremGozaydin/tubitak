const { RandErkekIsim, RandKadinIsim, RandTelNo, RandTCNo, RandTarih, RandSoyad, RandDg, RandBolum, RandFromArray } = require('./random_info')

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017');


let ReceteSchema = new mongoose.Schema({
    r_tarih: { type: String, required: true},
	r_desc: { type: String, required: true },
	r_doktor: { type: mongoose.Types.ObjectId, required: true },
	k_id: { type: Number, required:true },
	h_id: { type: mongoose.Types.ObjectId, required: true, ref: 'hasta' }
})

let KayitSchema = new mongoose.Schema({
	k_id: Number,
	k_tarih: { type: Date, required:true },
	k_desc: { type: String, required:true },
	k_recete: { type: mongoose.Types.ObjectId }
})

let HastaSchema = new mongoose.Schema({
	h_ad: {type: String, required: true},
	h_soyad: {type: String, equired: true},
	h_tc: { type: String, required: true},
	h_tel: { type: String, required: true},
	h_dg: { type: Date, required: true},
	h_cinsiyet: { type: String, required: true, enum: ['erkek','kadin']},
	h_kayitlar: [KayitSchema]
})

let DoktorSchema = new mongoose.Schema({
	d_isim: { type: String, required: true},
	d_soyisim: { type: String, required: true},
	d_telefon: { type: String, required: true},
	d_bolum: {
		type: String,
		enum: ["radyoloji","cildiye","pediatri","dahiliye","gastroentoloji","kardiyoloji"],
		required: true
	}
})

let HastaModel = mongoose.model("hasta", HastaSchema);

let DoktorModel = mongoose.model('doktor', DoktorSchema);

let ReceteModel = mongoose.model('recete', ReceteSchema);

let CreateRandomDoktor = () => {
	let cins = Math.random() > 0.5
	return {
		d_isim: cins ? RandErkekIsim() : RandKadinIsim(),
		d_soyisim: RandSoyad(),
		d_telefon: RandTelNo(),
		d_bolum: RandBolum()
	}
}

let PickRandomDoktor = async () => {
	return (await DoktorModel.aggregate([{ $sample: { size: 1 } }]).exec())[0]['_id']
}

let CreateRandomRecete = async ({h_id,k_id}) => {
	let recete = {
		r_tarih: RandTarih(),
		r_desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
		r_doktor: await PickRandomDoktor(),
		h_id: h_id,
		k_id: k_id
	}
	return recete
}

let CreateRandomKayit = async () => {
	let kayit =  {
		k_tarih: RandTarih(),
		k_desc: 'abo'
	}
	return kayit
}

let CreateRandHasta = async () => {
	let cins = Math.random() > 0.5;
	let kayitlar = [];

	for (let i=0; i<Math.floor(Math.random() * 3 + 1); i++) {
		let kayit = await CreateRandomKayit();
		kayitlar.push({...kayit, k_id: i});
	};

	let hasta = {
		h_ad: cins ? RandErkekIsim() : RandKadinIsim(),
		h_soyad: RandSoyad(),
		h_tc: RandTCNo(),
		h_tel: RandTelNo(),
		h_dg: RandDg(),
		h_cinsiyet: cins ? 'erkek': 'kadin',
		h_kayitlar: kayitlar
	}
	return hasta
}

let CreateHasta = async () => {
	for (let i = 0; i < 1000; i++) {
		let hasta = await CreateRandHasta()	
		let {h_ad,h_soyad} = hasta
		let same_name = await HastaModel.exists({h_ad,h_soyad});
		if (same_name !== null) {
			console.log(same_name,hasta)
			continue
		}
	}
}

let CreateRecete = async () => {
	let hastalar = await HastaModel.find({});


	console.log(hastalar)

	for (hasta of hastalar) {
		let kayitlar = hasta.h_kayitlar;
		for (kayit of kayitlar) {
			await ReceteModel.create(await CreateRandomRecete({k_id: kayit.k_id, h_id: hasta._id}))
		}
	}

	console.log(await ReceteModel.find({}))
}

let Rand100Hasta = async () => {
	let rand100hasta = await HastaModel.aggregate([{ $sample: { size: 100 } }, { $project: { h_ad: 1, h_soyad: 1, _id: 0 } }]).exec()
	
	return rand100hasta
}

let Rand20Doktor = async () => {
	let rand20doktor = await DoktorModel.aggregate([{ $sample: { size: 20 }}, { $project: { _id: 1, d_isim: 1, d_soyisim: 1 } }]).exec();

	return rand20doktor
}

let hastaIsimdenKayit = async () => {
	let hastalar = await Rand100Hasta();

	let kayitlar = [];

	let startTime = new Date()

	for (hasta of hastalar){
		let hasta_data = await HastaModel.findOne({h_ad: hasta.h_ad,h_soyad: hasta.h_soyad});
		kayitlar.push(hasta_data)
	}

	let endTime = new Date()

	return endTime-startTime
}

let DoktordanRecete = async () => {
	let rand20doktor = await Rand20Doktor();

	let startTime = new Date()

	doktorReceteler = [];

	for (doktor of rand20doktor){
		let receteler = await ReceteModel.find({'r_doktor':doktor._id});
		doktorReceteler.push({...doktor,...receteler});
	}

	let endTime = new Date()

	console.log(endTime-startTime)

	return endTime-startTime

}

let main = async () => {
	let sureler = [];

	let int_id = setInterval(async () => {
		sureler.push(await DoktordanRecete());
	},1000)

	setTimeout(() => {
		clearInterval(int_id);
		console.log(sureler.reduce((a,b) => a+b)/sureler.length)
	},11000);

}

main()