(function (root, factory) {if (typeof define === 'function' && define.amd) {define(['exports', 'echarts'], factory);} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {factory(exports, require('echarts'));} else {factory({}, root.echarts);}}(this, function (exports, echarts) {var log = function (msg) {if (typeof console !== 'undefined') {console && console.error && console.error(msg);}};if (!echarts) {log('ECharts is not Loaded');return;}if (!echarts.registerMap) {log('ECharts Map is not loaded');return;}echarts.registerMap('bazhong', {"type":"FeatureCollection","features":[{"type":"Feature","id":"511900","properties":{"name":"巴中市","cp":[106.753669,31.858809],"childNum":3},"geometry":{"type":"MultiPolygon","coordinates":[["@@B@@CCB@BB@"],["@@BA@AA@@A@A@@@@BAF@@@FAB@AAAAA@@@BA@ABA@C@@B@@BB@BAB@BA@@BB@@@B@@AB@@@@@BB@@@B@BABA@@BAB@@@@@BBB@B@@@@@B@@@DBB@@@B@@@AB@@BB@@BDBBBB@@BBDAFAB@@@BB@@@BHAFSDGJUDCBEFGFCHGJADAFAFAF@JBFDHDDBHDHDHBH@LDFALDDB@@@@A@A@A@@BBB@B@B@@@@@BB@B@@@@D@@@@@@B@@@B@B@@@B@@A@@B@@BB@@@B@@@@@BB@@@@BAB@@B@@AB@@B@@@B@B@@@BBB@BBD@@BB@@@B@B@BBB@DB@@@BB@J@FCDAFCHANBJ@J@JAHHFBFDDBB@DABAFEDCFEHCDCD@DCB@D@B@@@@@D@DBB@BAB@@@BABCDQBALIBADEBCBA@C@E@CCE@A@A@CBC@ADGFM@ABAFABA@ABC@A@EBC@@BADAFAHCAA@AAACCAAGCAAECAE@ABE@KBG@M@AEC@@BKDEBAEEECA@@@@CDC@C@AAAA@GCAACCAC@@ACGGGEEC@ABA@AE@@@FC@E@A@CDCBA@A@@B@BA@C@CBEDC@@@CB@BADC@CAAA@A@ABABCBA@AAA@A@EACC@ACAC@@A@ADCBCBCBABCBE@EBA@AAAA@AB@@ABE@C@A@@B@DAD@B@B@@@B@B@@ADCD@@CAGAG@IAC@MGECEAEAEAA@ACAC@EDE@K@EAACAAI@CFA@AAEACCK@EBABE@ADAJEDAF@BA@@@@CCCCCCA@@@@ADB@@FBDBD@B@@@CC@CB@BBBBHD@@BCHDFBB@DAFCB@D@H@NDB@D@DAFCDCDCDAFE@CB@DABCBAJEFEFE@CB@@BBBBBD@DBB@@@HCPMLGDC@ABAHBB@DADC@AAAAA@@@@BABA@@B@@BDAB@BC@ABADADCFEBABGDCBCBC@C@ABA@ACCECGICCEKAACACAM@@CA@@AACCCAEAA@@A@AB@@AAE@AAEACACCAAAAC@A@CAC@CAEA@@ABCA@@CGEEICCCA@CACAA@CC@C@@@@C@AAA@CB@@ADADCBA@@@@ABEAEL@@AAAAA@A@ACC@B@BCDEBE@C@@AAC@@A@@@ABCFCBCBA@@AA@ACC@CAA@K@A@A@GDCBC@A@C@EDC@CBABC@AAECEBCCGEA@A@A@CAA@A@ACCAEBABA@@@ACC@CCEC@A@@DC@@@ADA@ACEAAA@A@C@MAECA@@AAABC@ACCBADCTKFE@E@EAAGECCAGC@AAACCAAAC@@@A@A@EBC@A@A@CC@AAA@@AA@ACAGDA@A@E@A@@AC@CAAAAA@A@C@EBEDGFCDAK@A@CDCBABABEAC@C@A@ABC@AAA@CACAAADC@ABCBABC@CB@BAFEFAB@DADABCBCDCBCLAHA@AFA@ABCCG]YAAC@ABA@A@ABA@@B@F@FCBIBKA@@CC@CDCFG@AAAC@CBC@A@CA@@@C@O@AA@A@@BCJA@A@C@AACA@A@AA@BABAJE@@B@BAF@FCTGLCLCJGFCFAHBF@HGFEHAPAB@DC@@B@@A@GBABABEBC@ACGCEECECCA@ABCAIACCECGAC@C@E@AAG@ECOACCAAAGCEAA@GAAAAAC@AAA@@AAC@C@ABA@@DIBGDG@CAECCIAAACA@ABADCDA@C@C@AC@ABABABABABCBE@@@@BAJABCBA@A@A@CACAC@A@GAC@CAACBC@AA@A@A@ABADABA@AACC@@AAEEBAB@DBDF@@B@BABC@AAAAAAABA@ADCNE@A@I@C@MDC@AB@FCJCBCFIBAB@B@DDB@FBDBDAD@BABACCBE@GCKAIBABEBCEEA@AAAAAACCCIAE@AAE@AAAA@GACAA@AAACACAACAGAAA@@@AAAACAAAE@A@A@EDM@CACCEECAAA@KBA@A@A@@@A@A@AAA@E@EAAAEGAAEA@AAA@AAAC@CAA@@BAAA@@AA@@@ABABEFEFC@GACCAC@@AC@C@GCAAC@C@CBAC@CDA@A@E@@@AA@AAAA@A@A@A@@A@@@AA@EBAA@A@AA@C@AB@BAB@@C@@A@CDE@AAAA@@@@A@@AAAAE@C@A@AB@D@B@B@DCBC@E@CAAAIKACAAA@AAAAAA@@AD@BA@@@AABECECACACBG@A@AA@AAC@CCBCBAB@DADABC@AACCACAABCFE@C@C@AA@A@ABEDA@ABA@A@@AAA@@A@C@AAA@@ABABA@@AA@@A@A@CBA@A@@@AAAC@C@ABEBGBEAC@AA@AEAGAE@A@C@AACAAAAACAAEAA@C@EACAA@C@EBE@G@A@E@C@A@C@EBAA@@CAACAC@C@C@GAEAECCAACG@@AAAAAC@G@ACECE@@CC@@CCCAA@A@C@AA@BCBCFABADABAHABABA@EDABEFABC@EAAC@A@CFG@A@AAAAAAAC@EAGABCBE@C@CACAE@A@@CCAAA@AAAAGAIEGDGBE@EBE@C@A@G@GAG@CBCAAACG@A@ECCCECACCAAAA@GAKCACA@A@ACEEIEGIK@EDCDCDAAI@G@E@EAGCEECGCE@A@EAAAAC@ABAAACCMEC@CACBIBEDC@ICC@AB@BDDAB@BABEDAB@BBBAB@BABI@ABA@ADAB@BBD@DABC@AB@B@BBBBBABADABCB@@A@ABADCBA@AA@CCQ@CAAC@C@ABADABA@A@EACAGMAACCCCAA@A@A@CBA@AFAFCB@@Y@ACAA@@@CDCBAAGECAIAACAC@CNQ@A@C@@A@@A@@AA@@BC@G@CC@C@KDABCB@@ABABABAB@@@@CB@@@@CBA@CAA@@AAA@ACE@@@ABA@@@A@A@@BA@@@AAA@AAC@AA@AA@@CAAA@@KCAAAA@A@ADEBCBGGCAACECC@@@@@BGBA@AAA@@CIWAAA@A@ABEHA@CBA@AAECA@@@CBAA@DIFGHEHA@C@C@@@@D@ABB@@BB@@@B@@@@@@@B@@@@@AA@@@A@@A@@@@A@@A@@A@ABABADBBHJJHXZBBABABCBA@AAA@AAAACAAA@@@@ECCAC@ABC@CHARIHCD@DBDDBBFDPBDBBDDB@B@BB@B@B@BBF@D@D@@BBC@CBE@AB@ACB@@ABA@ADA@A@A@ADAD@@@B@D@FABCDGJCHAFABA@IDAB@BBBFD@BEB@BMBEBCDADE@C@AAC@A@ADADABADABA@AAACCCA@AACBEBAD@D@D@DABADCBC@G@ABDH@BBBBBPLDBFJDB@BABABODCBAB@BAB@B@BBJ@@@BA@ABGD@@GCAA@DENADADCDABA@CCICC@A@CDAD@BBDB@DBF@B@@BADAB@B@BBB@BAB@B@@DBB@B@B@@@@@AB@D@@ABCDCB@@A@@@@PABBDDB@BBBAB@BAB@B@BAF@DBBA@@F@B@BA@C@ABADCBEDKDAB@BBBDB@D@@ABC@A@AACCC@A@A@C@CB@BBD@BCDAB@D@@BB@BBB@@@B@B@@@DBD@@BBB@BAB@BBBB@@@B@@BB@@@@AB@@@BB@@B@@D@@BB@@@@@AB@B@@@BB@AB@@A@AB@@@B@@@BA@@@AA@A@@CB@@A@@@KGAAG@MEECAA@AAAGAAAAAA@C@A@ABAD@BADABE@CAICC@C@AD@BBDFDBB@BAJEHADBBBBB@F@@@FFDB@D@D@DCFCFABCBA@@A@ABGAA@ACBABA@AAAAAAAAABABEBC@GAKEA@EBCBEAEAC@EBC@ACAAABA@AFAHADCBC@IAIAEACAEA@@AAAAACAC@AA@G@CBCBCF@B@D@BA@A@A@E@CAA@A@AD@B@DADADEBAD@D@BB@@@D@LCD@D@BB@B@BABABCDGBGAEAAABAAA@@@AC@C@AAA@A@AB@B@@@B@@@@ABA@@@@BC@A@ABCDAB@@CACAAA@C@A@CAAAAAA@AAC@AGECCAC@C@A@@BCBA@ADC@E@EBCLODA@AACAA@@ACEACOAAC@EA@@ACAABABCBA@AA@E@A@ACAEBGCAG@GAEAEAEAEBGBKDCBOJCBE@GAE@GBEBCDADADBDDBBFBDADEF@B@BBBBB@@@B@@BD@B@@@BABA@E@@BAHADADABCBCBC@ABAD@BABIFABGD@BABABC@C@A@AAAACBABADC@CBE@ABA@@@CABAAAAE@CA@@@AAA@@@CCA@E@CAABCDCBA@A@AAA@A@C@A@AB@BAB@B@DAD@BED@BAD@D@BABA@@@A@ECC@CAABE@ABA@ABABA@EBAACBABABADBD@BABA@CBA@AB@BBBFFBB@F@H@FABADABBD@DDBBB@DAPADABABC@CBAB@BBBBB@@BB@BAFAB@BABCBCBA@ADCFAB@@A@A@A@CCA@AAA@E@CBEB@@@B@BA@A@ABA@@BA@@BBD@@@@AB@@AAA@@CAA@@@AA@ABAA@@AAA@@B@B@@@BA@CAAB@@AB@BA@@B@@@@@B@@@BBB@@@BB@AB@BABA@A@ABA@A@A@AB@@BD@B@@@B@@@B@@BB@@ABAB@@BB@@ABAB@@CBEDABED@@A@A@C@KDCBA@ABCDABA@GBCBABA@AF@@@B@BBDBBDBHBB@BB@B@B@B@BD@B@BB@DBBBBDDBBBDAB@BCDAD@BAF@BDBD@B@@A@CBABAB@FBB@DABAH@BABADCB@B@BBBBBBBD@FADBBBBBBBBBD@B@HABA@EDAD@DFHD@DBFAF@DAH@B@@B@BABCBADABABCHABGFEHABADAJ@BADAD@@A@ABA@@B@@BBDBB@@BEDABADABAF@B@DCDD@D@HDB@DBBDAFBFAFBBDFBFFHFD@@BD@BABGF@@CDEL@H@D@DABBFDLAJCH@DBFDFHDJDDBFFBD@BADABC@E@A@E@C@A@ABABAD@B@B@BBBDBD@J@DBBBDBBBDB@BBBBD@F@@@@BB@J@D@@BBDBFJBBBBBBDBFFFJBDDD@@DBFBF@BABCDCF@B@DBBF@DCNCHEHGHEFEFGJAD@BDBB@D@BADABAD@FADBD@DFB@@BDAD@DADAFCJABBBFDFAHBDDDDDBFDLB@@B@HBB@@BBDBFAD@DAD@@D@BBBBHBF@N@B@BCBA@C@AB@B@D@F@@@BAB@BABBFBFAB@F@B@BB@B@HAP@D@D@BB@BCFED@D@B@D@BBD@DBB@BBBFBFDHJDFDDB@B@B@DALEFABAD@HBDBFDDD@B@BAD@BABE@IBABA@CBCDABEDEB@BAB@B@B@DBF@BBFBBF@BBD@J@D@DB@B@JBDDDJHNF@D@DAPCRCN@F@DBDBJADKJABAD@DFLBF@F@F@BAFBD@JFdDJFDHDHBXFJBDDF@D@LBZDRDLBJDB@F@HAHBLBPDD@DBBDDFDFBD@B@DDN@D@BBBBAFAB@B@BBBDBBD@@@@@BE@@BA@CAAAB@A@AB@B@@AD@DBFCBAB@DBHBDBFADANDBBBBBL@J@DEDC@CD@BDDDFBFHABBD@B@D@D@DCFAL@DALCFCDABAB@BB@BAFBBB@FBB@DDBDJ@L@BBBB@@ADAFABCDABC@CBA@A@EBAD@BABBB@FBB@@DA@DB@BB@BBBA@C@A@@AA@CAA@AC@EAAAA@BBB@@ABA@@BCBA@@DCBA@CDCBAACCAAC@@@DCCAAAEB@B@DAB@@A@@@BB@BC@@@@@BDBD@@@BABAB@BEHEHOJGDEDCBA@C@AAIAGACAA@CBCBAF@B@DDHJJ@BBDAB@BADCDAB@JBF@B@B@F@D@DBB@B@B@FAB@B@B@BBBAB@B@B@BDD@B@@C@A@@@@@@D@@BB@@D@@@BB@FBB@BA@AFB@@BB@A@ABA@B@ABEAE@E@@BADB@@@AD@B@BDD@DBFC@AB@@@@@DAH@FBHBDBFBBDBBB@BADAFEHCDEDCBADAB@BDLBHCDADCBSJEFGFGBABCDAD@B@B@BBDJLFF@D@B@B@BCDA@@BAB@BBN@D@J@D@B@DBBBDBD@B@BCBCD@F@B@DFHBD@FAF@HERCF@DABBJALBBDBDFDFBD@FCRADCBADEBCDAFEHCJ@F@F@F@F@FADAD@F@B@F@L@J@JAHHDB@PAFBJBFBNHFFDFJHDFDDNDJDVPHHJFHDPBBDBDFHBBDAFAHALAV@LBJ@H@NBDADA@C@AEIAABE@EBC@C@EAE@CBG@CBAACBCDABA@@B@DD@@BD@B@B@@BD@BBB@@@B@H@BD@B@FAB@BBH@H@JAJCBCFADAD@DBDFFDF@F@BBFBDDBFDFDBNDN@HBNBDADEB@H@DAFAD@LFDBFAHABA@A@G@CDCDCFEDEFAD@HFLBZBFBDBDDBFBBDBFAD@D@F@HBLAFCTEF@F@BDDFDBDBJBF@DBBBD@H@D@DCB@D@F@D@D@BABADIFABAF@HDH@D@DADAFBB@FBDAH@FABCAAAEACAG@ECEAM@GBIDCDEHCHAHBPCFAFEDEFGDIDE@KAEAG@G@E@EFIBKJOBGBGCOCGEMES@IEQEMIEGGEEDC@IBEDEFEHAHEDEHAFCDIHIBEFGDEHKBEDEBCFAPCDAFAB@BA@@B@B@@@H@DBB@@A@@@A@@@AB@@@BBD@B@@@B@@AB@B@@AD@B@@@B@@@BBB@BB@@@BJAHCJALEJEDIHEHIDEBGDEBEBGHMDEFEFCFETIHCREHCFCJCDAFAHALHBLAHDHHFFHJNBJBL@H@LDFFBDBHDFDBF@L@D@F@DDFHHHDHDLDHDRFHBRHNFJDFFDFFHDF@DHHFJDF@DDD@DJDHATBHAL@LCJCLAHAFAFCF@BA@C@AAE@CBEBC@A@A@@AAAC@AAAEGCE@A@A@@DE@@BA@A@A@A@@BABE@@@AA@@E@E@AAA@@BA@@@E@@BA@@B@B@BBB@BA@A@@@@@@AAA@@@BA@A@A@@@E@@@@@ABA@@@A@@@A@@D@@@BABABABA@@@@@B@B@@CB@B@@B@B@B@F@B@@@@@@A@A@@@A@AB@B@B@BAFABAB@@A@ABA@AB@@A@@@EB@AEAC@@@AB@@@BA@@BA@A@AA@@@@@A@@@A@A@@A@A@C@@AACA@AA@A@A@@ACA@@AA@A"],["@@B@AAABE@C@@@@A@A@AAE@A@A@@AAAAAA@A@BABC@ABEHABAB@FBBBBB@A@BBB@@A@@@@@@@B@@@@@B@@DB@BBDAB@@BB@@B@BBB@B@@A@@@@DA@AB@@@B@B@@ABA@@@A@A@A@@@@@A@@@@BABA@@"]],"encodeOffsets":[[[109514,32016]],[[110029,33209]],[[108981,32690]]]}}],"UTF8Encoding":true});}));