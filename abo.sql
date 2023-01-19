CREATE TABLE hasta (
    h_id INT(100) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (h_id),
	h_ad VARCHAR(100) NOT NULL,
	h_soyad VARCHAR(100) NOT NULL,
	h_tc INT(11) NOT NULL,
	h_tel INT(11),
	h_dg DATE NOT NULL,
	h_cinsiyet BOOLEAN(1) NOT NULL
);

CREATE TABLE kayit (
	k_tarih DATE() NOT NULL,
	k_id INT(20) NOT NULL AUTO_INCREMENT,
	k_recete INT(20) CONSTRAINT FOREIGN KEY ,
	PRIMARY KEY (k_id),
	FOREIGN KEY (k_recete) REFERENCES hasta(h_id)
);

{
	r_tarih: string,
	r_tani: string,
	r_doktor: number,
	r_ilac: string
}



ALTER TABLE recete ADD COLUMN r_doktor INT NOT NULL;
