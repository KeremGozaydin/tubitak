const { RandErkekIsim, RandKadinIsim, RandTelNo, RandTCNo, RandTarih, RandSoyad, RandDg, RandBolum, RandFromArray } = require('./random_info')

const { Sequelize, DataTypes, Deferrable } = require("sequelize");

const sequelize = new Sequelize("postgres://tubitak:tubitak123@localhost:5432/tubitak",{
  logging: console.log
})

const Hasta = sequelize.define('hasta', {
  h_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  h_ad: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  h_soyad: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  h_tc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  h_tel: {
    type: DataTypes.STRING
  },
  h_dg: {
    type: DataTypes.DATE,
    allowNull: false
  },
  h_cinsiyet: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: false
});

const Kayit = sequelize.define('kayit', {
    k_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    k_tarih: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    k_desc: {
      type: DataTypes.STRING
    },
    h_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Hasta,
        key: 'h_id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
},{
  freezeTableName: true,
  timestamps: false
})

const Doktor = sequelize.define('doktor', {
  d_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  d_ad: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
  d_soyad: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
  d_tel_no: { type: DataTypes.STRING, allowNull: false },
  d_bolum: { type: DataTypes.STRING, allowNull: false }
},{
  freezeTableName: true,
  timestamps: false
});

const Recete = sequelize.define('recete', {
  r_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  r_desc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  r_tarih: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  d_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Doktor,
      key: 'd_id'
    },
  k_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Kayit,
      key: 'k_id'
    }
  }
  }
},{
  freezeTableName: true,
  timestamps: false
})



Doktor.hasMany(Recete, {
  foreignKey: 'd_id'
});
Recete.belongsTo(Doktor);
Hasta.hasMany(Kayit, {
  foreignKey: 'h_id'
});
Kayit.belongsTo(Hasta);
Kayit.hasOne(Recete, {
  foreignKey: 'k_id'
});
Recete.belongsTo(Kayit);

let CreateRandHasta = () => {
  let cins = Math.random() > 0.5
  return {
    h_ad: cins ? RandErkekIsim() : RandKadinIsim(),
    h_soyad: RandSoyad(),
    h_tc: RandTCNo(),
    h_tel: RandTelNo(),
    h_dg: RandDg(),
    h_cinsiyet: cins ? 'erkek' : 'kadin'
  }
}

let CreateRandDoktor = () => {
  let cins = Math.random() > 0.5
  return {
    d_ad: cins ? RandErkekIsim() : RandKadinIsim(),
    d_soyad: RandSoyad(),
    d_tel_no: RandTelNo(),
    d_bolum: RandBolum()
  }
}

let PickRandHasta = async () => {
  return RandFromArray(await Hasta.findAll())
}

let CreateRandKayit = ({h_id}) => {
  let kayit =  {
    k_tarih: RandTarih(),
    k_desc: '',
    h_id: h_id
  }
  return kayit
}

let PickRandDoktor = async () => {
  return RandFromArray(await Doktor.findAll())
}

let PickRandKayit = async () => {
  return RandFromArray(await Kayit.findAll())
}

let CreateRandRecete = async ({k_id}) => {
  let doktor = await PickRandDoktor();
  return {
    r_desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
    k_id: k_id,
    d_id: doktor.dataValues['d_id'],
    r_tarih: RandTarih()
  }
}

let CreateKayit = async () => {
  let hastalar = await Hasta.findAll();

  for (hasta of hastalar) {
    let data = hasta.toJSON();

    let kayitlar = [];

    for (let i=0; i<Math.floor(Math.random() * 3 + 1); i++) {
      let kayit = CreateRandKayit(data);
      kayitlar.push(kayit);
    };

    for (kayit of kayitlar) {
      await Kayit.create(kayit);
    }

  }
}

let CreateRecete = async () => {
  await Recete.sync({force: true});

  let kayitlar = await Kayit.findAll();

  for (kayit of kayitlar) {
    let data = kayit.toJSON();
    let recete = await CreateRandRecete(data);
    await Recete.create({...recete, k_id: data.k_id})
  }
}

let Random100Hasta = async () => {
  let allHasta = await Hasta.findAll();
  allHasta.sort(() => 0.5 - Math.random());
  return allHasta.slice(0,100);
}

let Random20Doktor = async () => {
  let allDoktor = await Doktor.findAll();
  allDoktor.sort(() => 0.5 - Math.random());
  return allDoktor.slice(0,100);
}
 
let HastaIsimdenKayitlar = async () => {
  let rand100hasta = (await Random100Hasta()).map((hasta) => hasta.toJSON());

  let startTime = new Date();
  
  let kayitlar = [];

  for (hasta of rand100hasta) {
    let hastaData = (await Hasta.findOne({ where: { h_ad: hasta.h_ad, h_soyad: hasta.h_soyad }, 
      include: {all: true} })).toJSON();
    kayitlar.push({...hastaData})
  }

  let endTime = new Date();

  return endTime-startTime

}

let DoktordanRecete = async () => {
  let doktorlar = (await Random20Doktor()).map(doktor => doktor.toJSON());

  let startTime = new Date();

  let kayitlar = [];

  for (doktor of doktorlar) {
    let receteler = (await Recete.findAll({where: {
      d_id: doktor.d_id
    }}))
    .map(recete => recete.toJSON());
    kayitlar.push({...doktor, receteler});
  }

  let endTime = new Date();

  return endTime-startTime

}

let main = async () => {
  let sureler = [];

	let int_id = setInterval(async () => {
		sureler.push(await HastaIsimdenKayitlar());
	},1000)

	setTimeout(() => {
		clearInterval(int_id);
		console.log(sureler.reduce((a,b) => a+b)/sureler.length)
	},11000);
}

main()