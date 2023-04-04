import {init,formatStringToDate} from '../server.mjs'
import chai from 'chai'
import chaiHttp from 'chai-http'

let should = chai.should()
chai.use(chaiHttp)


// Tests de la route 404 quand on met n'importe quel argument
describe('default route', () => {
    let server;

    beforeEach(async () => {
        server = await init();

    });

    afterEach(async () => {
        await server.stop();
    });

    it('expected default route ', async () => {

        const res = await server.inject({
            method: 'get',
            url: '/api/v1/brasserie'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({message: 'not found'})
    })
});


////// TEST DES ROUTES
// Tests de la route /populate/{type}
describe('/populate/{type}', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    
    //rooms
    describe('/populate/rooms', () => {
        it('must show rooms', async () => {

            const res = await server.inject({
                method: 'get',
                url: '/populate/rooms'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                {
                    "id": 1299,
                    "name": "C0/01",
                    "computerRoom": true
                },
                {
                    "id": 1300,
                    "name": "C0/03",
                    "computerRoom": true
                },
                {
                    "id": 1301,
                    "name": "C0/04",
                    "computerRoom": true
                },
                {
                    "id": 1310,
                    "name": "E0/01",
                    "computerRoom": false
                },
                {
                    "id": 1311,
                    "name": "E0/02",
                    "computerRoom": false
                },
                {
                    "id": 1315,
                    "name": "E1/13",
                    "computerRoom": true
                },
                {
                    "id": 1316,
                    "name": "E1/14",
                    "computerRoom": true
                },
                {
                    "id": 1318,
                    "name": "E1/17",
                    "computerRoom": true
                },
                {
                    "id": 1320,
                    "name": "E2/22",
                    "computerRoom": false
                },
                {
                    "id": 1329,
                    "name": "F1/11",
                    "computerRoom": false
                },
                {
                    "id": 1331,
                    "name": "F2/22",
                    "computerRoom": true
                },
                {
                    "id": 89804,
                    "name": "C0/05",
                    "computerRoom": false
                },
                {
                    "id": 89806,
                    "name": "C0/02",
                    "computerRoom": true
                },
                {
                    "id": 89807,
                    "name": "C1/11",
                    "computerRoom": true
                },
                {
                    "id": 89808,
                    "name": "C1/14",
                    "computerRoom": true
                }
            ])
        });
    });

    //schedules
    describe('/populate/groups', () => {
        it("must show groups", async () => {
            const res = await server.inject({
                method: 'get',
                url: '/populate/groups'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                {
                    "id": 3163,
                    "name": "INFO 1 TP 1-1"
                },
                {
                    "id": 3164,
                    "name": "INFO 1 TP 1-2"
                },
                {
                    "id": 3165,
                    "name": "INFO 1 TP 2-1"
                },
                {
                    "id": 3166,
                    "name": "INFO 1 TP 2-2"
                },
                {
                    "id": 3167,
                    "name": "INFO 1 TP 3-1"
                },
                {
                    "id": 3168,
                    "name": "INFO 1 TP 3-2"
                },
                {
                    "id": 3170,
                    "name": "INFO 1 TP 4-1"
                },
                {
                    "id": 3173,
                    "name": "INFO 1 TP 4-2"
                },
                {
                    "id": 3183,
                    "name": "INFO 2 TP 1-1"
                },
                {
                    "id": 3184,
                    "name": "INFO 2 TP 1-2"
                },
                {
                    "id": 3187,
                    "name": "INFO 2 TP 2-1"
                },
                {
                    "id": 3188,
                    "name": "INFO 2 TP 2-2"
                },
                {
                    "id": 3189,
                    "name": "INFO 2 TP 3-1"
                },
                {
                    "id": 3190,
                    "name": "INFO 2 TP 3-2"
                },
                {
                    "id": 3191,
                    "name": "INFO 2 TP 4-1"
                },
                {
                    "id": 3192,
                    "name": "INFO 2 TP 4-2"
                }
            ])
        });
    });

    // teachers
    describe('/populate/teachers', () => {
        it('must show teachers', async () => {

            const res = await server.inject({
                method: 'get',
                url: '/populate/teachers'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                {
                    "id": 2191,
                    "name": "Sebastien CAZALAS"
                },
                {
                    "id": 2208,
                    "name": "Arnaud LANOIX"
                },
                {
                    "id": 2232,
                    "name": "Jean-Marie MOTTU"
                },
                {
                    "id": 2251,
                    "name": "Gilles NACHOUKI"
                },
                {
                    "id": 2273,
                    "name": "Christine JACQUIN"
                },
                {
                    "id": 2281,
                    "name": "Didier KUEVIAKOE"
                },
                {
                    "id": 2282,
                    "name": "Jérémie ATTIOGBE"
                },
                {
                    "id": 2285,
                    "name": "Abdelghani HADJ-RABIA"
                },
                {
                    "id": 2293,
                    "name": "Sebastien FAUCOU"
                },
                {
                    "id": 2295,
                    "name": "Dalila TAMZALIT"
                },
                {
                    "id": 2318,
                    "name": "Nicolas HERNANDEZ"
                },
                {
                    "id": 2320,
                    "name": "Jean-François REMM"
                },
                {
                    "id": 2377,
                    "name": "François SIMONNEAU"
                },
                {
                    "id": 20813,
                    "name": "Solen QUINIOU"
                },
                {
                    "id": 121449,
                    "name": "Loïg JEZEQUEL"
                },
                {
                    "id": 192001,
                    "name": "Véronique CHARRIAU"
                },
                {
                    "id": 360071,
                    "name": "Jean-François BERDJUGIN"
                },
                {
                    "id": 611699,
                    "name": "Paul COLEMAN"
                },
                {
                    "id": 892394,
                    "name": "Johan LERAY"
                },
                {
                    "id": 893385,
                    "name": "Olfa ISMAIL"
                },
                {
                    "id": 1014776,
                    "name": "Olivier BOUTIN"
                }
            ])
        });
    });

    it("must show 404 - not found", async () => {
        const res = await server.inject({
            method: 'get',
            url: '/populate/bruh'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({message: 'not found'})
    });
});


//Tests de la route room/{id}/{time}
describe('room/{id}/{time}', () => {
    let server;

    beforeEach(async () => {
        server = await init();

    });

    afterEach(async () => {
        await server.stop();
    });

    /*  dépend de la date et l'heure actuelle
    it('should show room schedule of C0-05', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/89804'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql(
        [
            {
                "start":formatStringToDate("2023-03-30T09:35:00.000Z"),
                "end":formatStringToDate("2023-03-30T12:30:00.000Z"),
                "summary": "TD - PROJET PERSONNEL ET PROFESSIONNEL\\, GEA1 Promo\\, GODARD Claudio",
                "location": "J-Amphi 1\\, J-C0/05\\, J-D0/02\\, J-D1/12\\, J-D2/23\\, J-E0/01\\, J-E1/12\\, J-E1/16\\, J-Salle du Conseil",
                "roomId": 0
            }
        ]);
    });
    */

    it('should show room class of C0-05 at 30/03/2023 at 8:30 am and it has no class', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/89804/20230330T083000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])

    });

    it('should show room class of C0-04 at 30/03/2023 at  15:20 and it has class at this time', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/20230403T15400000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "start": formatStringToDate("20230403T151500000Z"),
                "end": formatStringToDate("20230403T175000000Z"),
                "id": undefined,
                "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 2",
                "location": "J-C0/04\\, J-C1/11",
                "roomId": 0
            }
        ])
    });

    it('should show error because the date is not well formated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/20230'
        });
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.result).to.be.eql({
            message : 'date invalide'
        })
    });

    it('should show not found because the id does not exist ', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/0000/20230330T152000000Z'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({
            message : 'not found'
        })
    });

    it('should show empty because the date is negative ', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/-20230330T152000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])
    });

    it('should show empty because the date is well formated but is recognized as 0230/03/30 ', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/200000000000000000000000000000000000000000000000000230330T15200000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])
    });

    // it('should show 404 because of bad params', async () => {
    //     const res = await server.inject({
    //         method: 'get',
    //         url: '/room/1301/20230330T152000000Z/yooo'
    //     });
    //     chai.expect(res.statusCode).to.equal(404);
    //     chai.expect(res.result).to.be.eql({
    //         message : "not found"
    //     })
    // });
});

// Tests /rooms/{computerRoomOnly}/{time}
describe('/rooms/{computerRoomOnly}/{time}', () => {
    let server;

    beforeEach(async () => {
        server = await init();

    });

    afterEach(async () => {
        await server.stop();
    });


    it('should show all empty non-computer rooms on the given date', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/false/20230330T152000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "id": 1299,
                "name": "C0/01",
                "computerRoom": true
            },
            {
                "id": 1300,
                "name": "C0/03",
                "computerRoom": true
            },
            {
                "id": 1301,
                "name": "C0/04",
                "computerRoom": true
            },
            {
                "id": 1310,
                "name": "E0/01",
                "computerRoom": false
            },
            {
                "id": 1318,
                "name": "E1/17",
                "computerRoom": true
            },
            {
                "id": 1329,
                "name": "F1/11",
                "computerRoom": false
            },
            {
                "id": 1331,
                "name": "F2/22",
                "computerRoom": true
            },
            {
                "id": 89804,
                "name": "C0/05",
                "computerRoom": false
            },
            {
                "id": 89807,
                "name": "C1/11",
                "computerRoom": true
            },
            {
                "id": 89808,
                "name": "C1/14",
                "computerRoom": true
            }
        ])
    });

    it('should show all empty computer rooms on the given date', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230330T152000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "id": 1299,
                "name": "C0/01",
                "computerRoom": true
            },
            {
                "id": 1300,
                "name": "C0/03",
                "computerRoom": true
            },
            {
                "id": 1301,
                "name": "C0/04",
                "computerRoom": true
            },
            {
                "id": 1318,
                "name": "E1/17",
                "computerRoom": true
            },
            {
                "id": 1331,
                "name": "F2/22",
                "computerRoom": true
            },
            {
                "id": 89807,
                "name": "C1/11",
                "computerRoom": true
            },
            {
                "id": 89808,
                "name": "C1/14",
                "computerRoom": true
            }
        ])
    });

    it('should show empty because there are no empty rooms', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230404T14420000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])
    });

    it('should show error because the date is not well formated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230'
        });
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.result).to.be.eql({
            "message": "date invalide"
        })
    });

    // it('should show 404 because of bad params', async () => {
    //     const res = await server.inject({
    //         method: 'get',
    //         url: '/rooms/true/20230/yooo'
    //     });
    //     chai.expect(res.statusCode).to.equal(404);
    //     chai.expect(res.result).to.be.eql({
    //         message : "not found"
    //     })
    // });
});


describe('/schedule', () => {
    let server;

    // Test route /schedule/day/{id}/{date}
    describe('/schedule/day/{id}/{date}', () => {
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
        

        it('should show 404 because the group does not exist', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/0000/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message: "not found"})
        });

        it('should show date invalide ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/3184/20230330'
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({
                message : "date invalide"
            })
        });

        it('should show empty table for the schedule of the group ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/3184/20230730T000000000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([])
        });

        /* Test dépendant de la date et l'heure actuelle
        it('should show the schedule of the room C0/03 for the day', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/1300'
            });
            chai.expect(res.statusCode).to.equal(200);
        });
        */

        it('should show the schedule of the day for the group', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/3184/20230330T152000000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                {
                    "start": formatStringToDate("20230330T080000000Z"),
                    "end": formatStringToDate("20230330T100000000Z"),
                    "id": undefined,
                    "summary": "DS=TD - Complément Web (parc. REAL)\\, INFO 2 Groupe 1\\, INFO 2 Groupe 4\\, BERDJUGIN Jean-François",
                    "location": "J-E1/13\\, J-E1/14",
                    "roomId": 0
                },
                {
                    "start": formatStringToDate("20230330T101000000Z"),
                    "end": formatStringToDate("20230330T122000000Z"),
                    "id": undefined,
                    "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                    "location": "J-C1/14",
                    "roomId": 0
                }
            ])
        });

    });


    // Test route /schedule/week/{id}/{date}
    describe('/schedule/week/{id}/{date}', () => {
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('should show 404 because the group does not exist', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/0000/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ])
        });

        it('should show empty tables for the schedule of the group ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/3184/20230730T000000000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ])
        });

        it('should show date invalide ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/3184/20230330'
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({
                message : "date invalide"
            })
        });

        // it('should show the schedule of the group C0/03 for the week', async () => {
        //     const res = await server.inject({
        //         method: 'get',
        //         url: '/schedule/week/3184'
        //     });
        //     chai.expect(res.statusCode).to.equal(200);
        // });

        // it('should show the not found because the params are not correct', async () => {
        //     const res = await server.inject({
        //         method: 'get',
        //         url: '/schedule/week/3184/20230330T11420000Z/bruh'
        //     });
        //     chai.expect(res.statusCode).to.equal(404);
        //     chai.expect(res.result).to.be.eql({
        //         message : "not found"
        //     })
        // });

        it('should show the schedule of the week for the group', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/3184/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                [],
                [
                    {
                        "start": formatStringToDate("20230327T080000000Z"),
                        "end": formatStringToDate("20230327T092000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, TAMZALIT Dalila",
                        "location": "J-C1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230327T093000000Z"),
                        "end": formatStringToDate("20230327T105000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement pour applications mobiles (parc. REAL)\\, INFO 2 Groupe 1\\, BOUTIN Olivier",
                        "location": "J-C1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230327T110000000Z"),
                        "end": formatStringToDate("20230327T122000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement pour applications mobiles (parc. REAL)\\, INFO 2 Groupe 1\\, BOUTIN Olivier",
                        "location": "J-C1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230327T133000000Z"),
                        "end": formatStringToDate("20230327T145000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, CAZALAS Sebastien",
                        "location": "J-F2/22",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230327T150000000Z"),
                        "end": formatStringToDate("20230327T162000000Z"),
                        "id": undefined,
                        "summary": "TD - Complément Web (parc. REAL)\\, INFO 2 Groupe 1\\, JACQUIN Christine",
                        "location": "J-F2/22",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230327T163000000Z"),
                        "end": formatStringToDate("20230327T175000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-F2/22",
                        "roomId": 0
                    }
                ],
                [
                    {
                        "start": formatStringToDate("20230328T080000000Z"),
                        "end": formatStringToDate("20230328T092000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, BERDJUGIN Jean-François",
                        "location": "J-C0/01",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230328T093000000Z"),
                        "end": formatStringToDate("20230328T105000000Z"),
                        "id": undefined,
                        "summary": "TD - Communication interne\\, INFO 2 Groupe 1\\, CAZALAS Sebastien",
                        "location": "J-C0/01",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230328T110000000Z"),
                        "end": formatStringToDate("20230328T122000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-C0/01",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230328T133000000Z"),
                        "end": formatStringToDate("20230328T145000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, REMM Jean-François",
                        "location": "J-C0/01",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230328T150000000Z"),
                        "end": formatStringToDate("20230328T162000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, TAMZALIT Dalila",
                        "location": "J-C0/01",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230328T163000000Z"),
                        "end": formatStringToDate("20230328T175000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, JACQUIN Christine",
                        "location": "J-C0/01",
                        "roomId": 0
                    }
                ],
                [
                    {
                        "start": formatStringToDate("20230329T080000000Z"),
                        "end": formatStringToDate("20230329T092000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, HERNANDEZ Nicolas",
                        "location": "J-E1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230329T093000000Z"),
                        "end": formatStringToDate("20230329T105000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, HERNANDEZ Nicolas",
                        "location": "J-E1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230329T110000000Z"),
                        "end": formatStringToDate("20230329T122000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, NACHOUKI Gilles",
                        "location": "J-E1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230329T133000000Z"),
                        "end": formatStringToDate("20230329T145000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, TAMZALIT Dalila",
                        "location": "J-E1/17",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230329T150000000Z"),
                        "end": formatStringToDate("20230329T162000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-Labo de Langues",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230329T163000000Z"),
                        "end": formatStringToDate("20230329T175000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1\\, MOTTU Jean-Marie",
                        "location": "J-E1/13",
                        "roomId": 0
                    }
                ],
                [
                    {
                        "start": formatStringToDate("20230330T080000000Z"),
                        "end": formatStringToDate("20230330T100000000Z"),
                        "id": undefined,
                        "summary": "DS=TD - Complément Web (parc. REAL)\\, INFO 2 Groupe 1\\, INFO 2 Groupe 4\\, BERDJUGIN Jean-François",
                        "location": "J-E1/13\\, J-E1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230330T101000000Z"),
                        "end": formatStringToDate("20230330T122000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-C1/14",
                        "roomId": 0
                    }
                ],
                [
                    {
                        "start": formatStringToDate("20230331T080000000Z"),
                        "end": formatStringToDate("20230331T092000000Z"),
                        "id": undefined,
                        "summary": "TD - Management avancé des Systèmes d'Information (parc. REAL)\\, INFO 2 Groupe 1\\, TAMZALIT Dalila",
                        "location": "J-E1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230331T093000000Z"),
                        "end": formatStringToDate("20230331T122000000Z"),
                        "id": undefined,
                        "summary": "DS=TD - Développement pour applications mobiles (parc. REAL)\\, INFO 2 Groupe 1\\, REMM Jean-François",
                        "location": "J-E1/13",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230331T133000000Z"),
                        "end": formatStringToDate("20230331T145000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-C1/14",
                        "roomId": 0
                    },
                    {
                        "start": formatStringToDate("20230331T150000000Z"),
                        "end": formatStringToDate("20230331T162000000Z"),
                        "id": undefined,
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 1",
                        "location": "J-C1/14",
                        "roomId": 0
                    }
                ],
                []
            ]);
        });
    });
});

//TODO Tests /teacher/{id}/{date}
describe('/teacher/{id}/{date}', () => {
    let server

    beforeEach(async () => {
        server = await init();

    });

    afterEach(async () => {
        await server.stop();
    });

    it('should show classes of Mr.Berdjugin at 30/03/2023 at 8:30 am', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/teacher/360071/20230330T083000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "start": formatStringToDate("20230330T080000000Z"),
                "end": formatStringToDate("20230330T100000000Z"),
                "id": undefined,
                "summary": "DS=TD - Complément Web (parc. REAL)\\, INFO 2 Groupe 1\\, INFO 2 Groupe 4\\, BERDJUGIN Jean-François",
                "location": "J-E1/13\\, J-E1/14",
                "roomId": 0
            },
            {
                "start": formatStringToDate("20230330T101500000Z"),
                "end": formatStringToDate("20230330T121500000Z"),
                "id": undefined,
                "summary": "DS=TD - Complément Web (parc. REAL)\\, INFO 2 Groupe 2\\, INFO 2 Groupe 3\\, BERDJUGIN Jean-François",
                "location": "J-E1/13\\, J-E1/14",
                "roomId": 0
            }
        ])
    });

    it('should show classes of Mr.Berdjugin at 30/03/2023 at 8:30 am and he has no classes', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/teacher/360071/20230326T07000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])
    });

    it('should show error because the date is not well formated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/teacher/360071/20230'
        });
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.result).to.be.eql({
            message : 'date invalide'
        })
    });

    it('should show not found because the id does not exist ', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/teacher/0000/20230330T152000000Z'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({message : 'not found'})
    });   
});


describe('/groups', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("must show groups", async () => {
        const res = await server.inject({
            method: 'get',
            url: '/populate/groups'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "id": 3163,
                "name": "INFO 1 TP 1-1"
            },
            {
                "id": 3164,
                "name": "INFO 1 TP 1-2"
            },
            {
                "id": 3165,
                "name": "INFO 1 TP 2-1"
            },
            {
                "id": 3166,
                "name": "INFO 1 TP 2-2"
            },
            {
                "id": 3167,
                "name": "INFO 1 TP 3-1"
            },
            {
                "id": 3168,
                "name": "INFO 1 TP 3-2"
            },
            {
                "id": 3170,
                "name": "INFO 1 TP 4-1"
            },
            {
                "id": 3173,
                "name": "INFO 1 TP 4-2"
            },
            {
                "id": 3183,
                "name": "INFO 2 TP 1-1"
            },
            {
                "id": 3184,
                "name": "INFO 2 TP 1-2"
            },
            {
                "id": 3187,
                "name": "INFO 2 TP 2-1"
            },
            {
                "id": 3188,
                "name": "INFO 2 TP 2-2"
            },
            {
                "id": 3189,
                "name": "INFO 2 TP 3-1"
            },
            {
                "id": 3190,
                "name": "INFO 2 TP 3-2"
            },
            {
                "id": 3191,
                "name": "INFO 2 TP 4-1"
            },
            {
                "id": 3192,
                "name": "INFO 2 TP 4-2"
            }
        ])
    });
});


describe('/teachers', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("must show teachers", async () => {
        const res = await server.inject({
            method: 'get',
            url: '/populate/teachers'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([
            {
                "id": 2191,
                "name": "Sebastien CAZALAS"
            },
            {
                "id": 2208,
                "name": "Arnaud LANOIX"
            },
            {
                "id": 2232,
                "name": "Jean-Marie MOTTU"
            },
            {
                "id": 2251,
                "name": "Gilles NACHOUKI"
            },
            {
                "id": 2273,
                "name": "Christine JACQUIN"
            },
            {
                "id": 2281,
                "name": "Didier KUEVIAKOE"
            },
            {
                "id": 2282,
                "name": "Jérémie ATTIOGBE"
            },
            {
                "id": 2285,
                "name": "Abdelghani HADJ-RABIA"
            },
            {
                "id": 2293,
                "name": "Sebastien FAUCOU"
            },
            {
                "id": 2295,
                "name": "Dalila TAMZALIT"
            },
            {
                "id": 2318,
                "name": "Nicolas HERNANDEZ"
            },
            {
                "id": 2320,
                "name": "Jean-François REMM"
            },
            {
                "id": 2377,
                "name": "François SIMONNEAU"
            },
            {
                "id": 20813,
                "name": "Solen QUINIOU"
            },
            {
                "id": 121449,
                "name": "Loïg JEZEQUEL"
            },
            {
                "id": 192001,
                "name": "Véronique CHARRIAU"
            },
            {
                "id": 360071,
                "name": "Jean-François BERDJUGIN"
            },
            {
                "id": 611699,
                "name": "Paul COLEMAN"
            },
            {
                "id": 892394,
                "name": "Johan LERAY"
            },
            {
                "id": 893385,
                "name": "Olfa ISMAIL"
            },
            {
                "id": 1014776,
                "name": "Olivier BOUTIN"
            }
        ])
    });
});   


//TODO Tests /user

describe('/user', () => {
    let server
    
    // Tests route /user/register
    describe('/user/register', () => {
        
        beforeEach(async () => {
            server = await init();
        });
        
        afterEach(async () => {
            await server.stop();
        });
        
        it('add user ok', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            chai.expect(res.statusCode).to.equal(201);
        })

        it('add existing user ', async () => {
            const res = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({message:"user already exists"})
        })

        it('wrong payload ', async () => {
            const res = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {fsdfsqdfsf:"test",fjdskmlf:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
        })
    });
    
    // Tests route /user/login
    describe('/user/login', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user login', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            const res = await server.inject({
                method: 'post',
                url: '/user/login',
                payload: {login:"test",password:"pass"}
            });

            chai.expect(res.statusCode).to.equal(201);
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'post',
                url: '/user/login',
                payload: {login:"existepas",password:"pass"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })

        it('wrong payload ', async () => {
            const res = await server.inject({
                method: 'post',
                url: '/user/login',
                payload: {fsdfsqdfsf:"test",fjdskmlf:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
        })
    });

    // Tests route /user/favoriteSchedule
    describe('/user/favoriteSchedule', () => {

        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteSchedule', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteSchedule',
                payload: {token: token.token, favoriteSchedule:3184}
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteSchedule:3184})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteSchedule',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds",favoriteSchedule:3184}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })

        it('wrong payload ', async () => {
            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteSchedule',
                payload: {fsdfsqdfsf:"test",fjdskmlf:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
        })
    });

    // Tests route /user/favoriteSchedule/{token}
    describe('/user/favoriteSchedule/{token}', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteSchedule', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            await server.inject({
                method: 'put',
                url: '/user/favoriteSchedule',
                payload: {token: token.result.token, favoriteSchedule:3184}
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteSchedule/' + token.result.token,
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteSchedule:3184})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteSchedule',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })
    });
    
    // Tests route /user/favoriteAddress
    describe('/user/favoriteAddress', () => {

        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteAddress', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteAddress',
                payload: {token: token.token, favoriteAddress:"3 rue maréchal joffre"}
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteAddress:"3 rue maréchal joffre"})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/"3 rue maréchal joffre"',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds", favoriteAddress:"3 rue maréchal joffre"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })

        it('wrong payload ', async () => {
            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteAddress',
                payload: {fsdfsqdfsf:"test",fjdskmlf:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
        })
    });

    // Tests route /user/favoriteAddress/{token}
    describe('/user/favoriteAddress/{token}', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteAddress', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            await server.inject({
                method: 'put',
                url: '/user/favoriteAddress',
                payload: {token: token.result.token, favoriteAddress:"3 rue maréchal joffre"}
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteAddress/' + token.result.token,
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteAddress:"3 rue maréchal joffre"})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteAddress',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })
    });

    // Tests route /user/favoriteTransitMode
    describe('/user/favoriteTransitMode', () => {

        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteTransitMode', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteTransitMode',
                payload: {token: token.token, favoriteTransitMode:"bicycling"}
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteTransitMode:"bicycling"})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteTransitMode',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds",favoriteTransitMode:"bicycling"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })

        it('wrong payload ', async () => {
            const res = await server.inject({
                method: 'put',
                url: '/user/favoriteTransitMode',
                payload: {fsdfsqdfsf:"test",fjdskmlf:"pass"}
            });
            chai.expect(res.statusCode).to.equal(400);
        })
    });

    // Tests route /user/favoriteTransitMode/{token}
    describe('/user/favoriteTransitMode/{token}', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        it('user favoriteTransitMode', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const token = await server.inject({
                method: 'post',
                url: '/user/register',
                payload: {login:"test",password:"pass"}
            });

            await server.inject({
                method: 'put',
                url: '/user/favoriteTransitMode',
                payload: {token: token.result.token, favoriteTransitMode:"bicycling"}
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteTransitMode/' + token.result.token,
            });

            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql({favoriteTransitMode:"bicycling"})
        })

        it('user not found ', async () => {
            await server.inject({
                method: 'delete',
                url: '/user'
            });

            const res = await server.inject({
                method: 'get',
                url: '/user/favoriteTransitMode',
                payload: {token:"fdjfkqslfjdlsmfjsdfjlds"}
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({message:"not found"})
        })
    });
});


// Tests de direction
describe('/directions/{origin}/{arrivalTime}/{transitMode?}', () => {
    let server;

    beforeEach(async () => {
        server = await init();

    });

    afterEach(async () => {
        await server.stop();
    });

    it('get directions ', async () => {
        const res = await server.inject({
            method: 'get',
            url: "/directions/'machines de l'ile nantes/1680521400000/transit"
        });

        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql({
            "geocoded_waypoints" : [
               {
                  "geocoder_status" : "OK",
                  "partial_match" : true,
                  "place_id" : "ChIJf0z7govrBUgR-eyKhZ2Su7E",
                  "types" : [ "establishment", "point_of_interest", "tourist_attraction" ]
               },
               {
                  "geocoder_status" : "OK",
                  "place_id" : "ChIJpy2TCz7wBUgRo4Ly_iTXbto",
                  "types" : [ "establishment", "point_of_interest", "university" ]
               }
            ],
            "routes" : [
               {
                  "bounds" : {
                     "northeast" : {
                        "lat" : 47.22322399999999,
                        "lng" : -1.5418138
                     },
                     "southwest" : {
                        "lat" : 47.2064871,
                        "lng" : -1.5676184
                     }
                  },
                  "copyrights" : "Map data ©2023",
                  "fare" : {
                     "currency" : "EUR",
                     "text" : "€1.70",
                     "value" : 1.7
                  },
                  "legs" : [
                     {
                        "arrival_time" : {
                           "text" : "1:27 PM",
                           "time_zone" : "Europe/Paris",
                           "value" : 1680521226
                        },
                        "departure_time" : {
                           "text" : "1:02 PM",
                           "time_zone" : "Europe/Paris",
                           "value" : 1680519744
                        },
                        "distance" : {
                           "text" : "3.4 km",
                           "value" : 3366
                        },
                        "duration" : {
                           "text" : "25 mins",
                           "value" : 1482
                        },
                        "end_address" : "3 Rue Maréchal Joffre, 44000 Nantes, France",
                        "end_location" : {
                           "lat" : 47.22322399999999,
                           "lng" : -1.5444447
                        },
                        "start_address" : "Parc des Chantiers, Bd Léon Bureau, 44200 Nantes, France",
                        "start_location" : {
                           "lat" : 47.2064871,
                           "lng" : -1.564284
                        },
                        "steps" : [
                           {
                              "distance" : {
                                 "text" : "0.4 km",
                                 "value" : 414
                              },
                              "duration" : {
                                 "text" : "6 mins",
                                 "value" : 336
                              },
                              "end_location" : {
                                 "lat" : 47.20896690000001,
                                 "lng" : -1.5676184
                              },
                              "html_instructions" : "Walk to Chantiers Navals",
                              "polyline" : {
                                 "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP`@tB"
                              },
                              "start_location" : {
                                 "lat" : 47.2064871,
                                 "lng" : -1.564284
                              },
                              "steps" : [
                                 {
                                    "distance" : {
                                       "text" : "0.1 km",
                                       "value" : 123
                                    },
                                    "duration" : {
                                       "text" : "2 mins",
                                       "value" : 97
                                    },
                                    "end_location" : {
                                       "lat" : 47.2074261,
                                       "lng" : -1.5651286
                                    },
                                    "html_instructions" : "Head \u003cb\u003enorthwest\u003c/b\u003e on \u003cb\u003eBd Léon Bureau\u003c/b\u003e toward \u003cb\u003eRue La Noue Bras de Fer\u003c/b\u003e",
                                    "polyline" : {
                                       "points" : "q_c_HvopHQPM@MJg@d@q@j@WVORKJ"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2064871,
                                       "lng" : -1.564284
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "0.2 km",
                                       "value" : 243
                                    },
                                    "duration" : {
                                       "text" : "3 mins",
                                       "value" : 199
                                    },
                                    "end_location" : {
                                       "lat" : 47.20913789999999,
                                       "lng" : -1.5670348
                                    },
                                    "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eBd Léon Bureau\u003c/b\u003e/\u003cwbr/\u003e\u003cb\u003ePont Anne de Bretagne\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eContinue to follow Bd Léon Bureau\u003c/div\u003e",
                                    "maneuver" : "turn-slight-left",
                                    "polyline" : {
                                       "points" : "mec_H`upHKZg@b@YXcAz@A?KJOLA@a@X_Ax@GFEHGJELABCLEPINCBKP"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2074261,
                                       "lng" : -1.5651286
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "48 m",
                                       "value" : 48
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 40
                                    },
                                    "end_location" : {
                                       "lat" : 47.20896690000001,
                                       "lng" : -1.5676184
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eQuai de la Fosse\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the left\u003c/div\u003e",
                                    "maneuver" : "turn-left",
                                    "polyline" : {
                                       "points" : "cpc_H|`qH`@tB"
                                    },
                                    "start_location" : {
                                       "lat" : 47.20913789999999,
                                       "lng" : -1.5670348
                                    },
                                    "travel_mode" : "WALKING"
                                 }
                              ],
                              "travel_mode" : "WALKING"
                           },
                           {
                              "distance" : {
                                 "text" : "2.2 km",
                                 "value" : 2169
                              },
                              "duration" : {
                                 "text" : "9 mins",
                                 "value" : 540
                              },
                              "end_location" : {
                                 "lat" : 47.2178215,
                                 "lng" : -1.5421464
                              },
                              "html_instructions" : "Tram towards Beaujoire / Ranzay",
                              "polyline" : {
                                 "points" : "_oc_HnbqH@AUeAWmAEWiCiMCMS_AS{@_@sAGQKY{@yCw@sCq@aCACs@iCK]K[CEISOa@Sa@S_@O[a@s@W_@Y_@m@{@Wc@GISg@Wu@s@aCGOk@oBi@gBGWCIAECGEQCQEOIa@Q_ASsAAC[gCCYo@gFCSIg@UiBCSEQYyAEQGYCS[eBI_@AIIc@CKI]Ok@Oe@Sk@Wo@u@cB]eA]iAOe@GSeAoDUs@oBoG?CMe@Me@Im@Io@Gi@E]AOIwAEs@AWJA"
                              },
                              "start_location" : {
                                 "lat" : 47.208957,
                                 "lng" : -1.5672773
                              },
                              "transit_details" : {
                                 "arrival_stop" : {
                                    "location" : {
                                       "lat" : 47.2178215,
                                       "lng" : -1.5421464
                                    },
                                    "name" : "Gare Nord"
                                 },
                                 "arrival_time" : {
                                    "text" : "1:17 PM",
                                    "time_zone" : "Europe/Paris",
                                    "value" : 1680520620
                                 },
                                 "departure_stop" : {
                                    "location" : {
                                       "lat" : 47.208957,
                                       "lng" : -1.5672773
                                    },
                                    "name" : "Chantiers Navals"
                                 },
                                 "departure_time" : {
                                    "text" : "1:08 PM",
                                    "time_zone" : "Europe/Paris",
                                    "value" : 1680520080
                                 },
                                 "headsign" : "Beaujoire / Ranzay",
                                 "line" : {
                                    "agencies" : [
                                       {
                                          "name" : "TAN",
                                          "phone" : "011 33 2 40 44 44 44",
                                          "url" : "http://www.tan.fr/"
                                       }
                                    ],
                                    "color" : "#007a45",
                                    "name" : "François Mitterrand / Jamet - Beaujoire / Ranzay",
                                    "short_name" : "1",
                                    "text_color" : "#ffffff",
                                    "vehicle" : {
                                       "icon" : "//maps.gstatic.com/mapfiles/transit/iw2/6/tram2.png",
                                       "name" : "Tram",
                                       "type" : "TRAM"
                                    }
                                 },
                                 "num_stops" : 5
                              },
                              "travel_mode" : "TRANSIT"
                           },
                           {
                              "distance" : {
                                 "text" : "0.8 km",
                                 "value" : 783
                              },
                              "duration" : {
                                 "text" : "10 mins",
                                 "value" : 606
                              },
                              "end_location" : {
                                 "lat" : 47.22322399999999,
                                 "lng" : -1.5444447
                              },
                              "html_instructions" : "Walk to 3 Rue Maréchal Joffre, 44000 Nantes, France",
                              "polyline" : {
                                 "points" : "qfe_HpelHASE[SFIDEc@KDEDAD]SK^Gl@C@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UCAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SRU_ACFEHk@dA_@v@CFAFg@UQGwBu@_A_@]pAGV"
                              },
                              "start_location" : {
                                 "lat" : 47.21785,
                                 "lng" : -1.5421683
                              },
                              "steps" : [
                                 {
                                    "distance" : {
                                       "text" : "36 m",
                                       "value" : 36
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 28
                                    },
                                    "end_location" : {
                                       "lat" : 47.2180358,
                                       "lng" : -1.5419968
                                    },
                                    "html_instructions" : "Head \u003cb\u003eeast\u003c/b\u003e toward \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                                    "polyline" : {
                                       "points" : "qfe_HpelHASE[SFID"
                                    },
                                    "start_location" : {
                                       "lat" : 47.21785,
                                       "lng" : -1.5421683
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "14 m",
                                       "value" : 14
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 9
                                    },
                                    "end_location" : {
                                       "lat" : 47.2180706,
                                       "lng" : -1.5418176
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eBd de Stalingrad\u003c/b\u003e",
                                    "maneuver" : "turn-right",
                                    "polyline" : {
                                       "points" : "wge_HndlHEc@"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2180358,
                                       "lng" : -1.5419968
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "13 m",
                                       "value" : 13
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 10
                                    },
                                    "end_location" : {
                                       "lat" : 47.2181721,
                                       "lng" : -1.5419064
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Ecorchard\u003c/b\u003e",
                                    "maneuver" : "turn-left",
                                    "polyline" : {
                                       "points" : "}ge_HjclHKDEDAD"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2180706,
                                       "lng" : -1.5418176
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "18 m",
                                       "value" : 18
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 13
                                    },
                                    "end_location" : {
                                       "lat" : 47.21832269999999,
                                       "lng" : -1.5418138
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e",
                                    "maneuver" : "turn-right",
                                    "polyline" : {
                                       "points" : "qhe_H|clH]S"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2181721,
                                       "lng" : -1.5419064
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "32 m",
                                       "value" : 32
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 23
                                    },
                                    "end_location" : {
                                       "lat" : 47.2184177,
                                       "lng" : -1.5422017
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e",
                                    "maneuver" : "turn-left",
                                    "polyline" : {
                                       "points" : "oie_HhclHK^Gl@"
                                    },
                                    "start_location" : {
                                       "lat" : 47.21832269999999,
                                       "lng" : -1.5418138
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "0.2 km",
                                       "value" : 159
                                    },
                                    "duration" : {
                                       "text" : "2 mins",
                                       "value" : 126
                                    },
                                    "end_location" : {
                                       "lat" : 47.21968820000001,
                                       "lng" : -1.5423138
                                    },
                                    "html_instructions" : "Slight \u003cb\u003eright\u003c/b\u003e",
                                    "maneuver" : "turn-slight-right",
                                    "polyline" : {
                                       "points" : "cje_HvelHC@?@A@EHEJILGHMLOJKFIBIBI?IAIAGEKGMKWSGEICGCICI?UC"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2184177,
                                       "lng" : -1.5422017
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "0.2 km",
                                       "value" : 218
                                    },
                                    "duration" : {
                                       "text" : "3 mins",
                                       "value" : 172
                                    },
                                    "end_location" : {
                                       "lat" : 47.2212453,
                                       "lng" : -1.5440072
                                    },
                                    "html_instructions" : "Slight \u003cb\u003eleft\u003c/b\u003e",
                                    "maneuver" : "turn-slight-left",
                                    "polyline" : {
                                       "points" : "are_HlflHAFEB}@p@QLKHOJMLIHCFEDGHEFEJGLADCHENADCDCBa@ZGFUV[^SR"
                                    },
                                    "start_location" : {
                                       "lat" : 47.21968820000001,
                                       "lng" : -1.5423138
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "27 m",
                                       "value" : 27
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 19
                                    },
                                    "end_location" : {
                                       "lat" : 47.2213562,
                                       "lng" : -1.5436923
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gambetta\u003c/b\u003e",
                                    "maneuver" : "turn-right",
                                    "polyline" : {
                                       "points" : "y{e_H`qlHU_A"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2212453,
                                       "lng" : -1.5440072
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "79 m",
                                       "value" : 79
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 63
                                    },
                                    "end_location" : {
                                       "lat" : 47.2218236,
                                       "lng" : -1.5444856
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e onto \u003cb\u003eRue Guillaume Grou\u003c/b\u003e",
                                    "maneuver" : "turn-left",
                                    "polyline" : {
                                       "points" : "o|e_H`olHCFEHk@dA_@v@CFAF"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2213562,
                                       "lng" : -1.5436923
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "0.1 km",
                                       "value" : 141
                                    },
                                    "duration" : {
                                       "text" : "2 mins",
                                       "value" : 107
                                    },
                                    "end_location" : {
                                       "lat" : 47.2230275,
                                       "lng" : -1.5439104
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eRue Gaston Turpin\u003c/b\u003e",
                                    "maneuver" : "turn-right",
                                    "polyline" : {
                                       "points" : "k_f_H`tlHg@UQGwBu@_A_@"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2218236,
                                       "lng" : -1.5444856
                                    },
                                    "travel_mode" : "WALKING"
                                 },
                                 {
                                    "distance" : {
                                       "text" : "46 m",
                                       "value" : 46
                                    },
                                    "duration" : {
                                       "text" : "1 min",
                                       "value" : 36
                                    },
                                    "end_location" : {
                                       "lat" : 47.22322399999999,
                                       "lng" : -1.5444447
                                    },
                                    "html_instructions" : "Turn \u003cb\u003eleft\u003c/b\u003e\u003cdiv style=\"font-size:0.9em\"\u003eRestricted usage road\u003c/div\u003e\u003cdiv style=\"font-size:0.9em\"\u003eDestination will be on the right\u003c/div\u003e",
                                    "maneuver" : "turn-left",
                                    "polyline" : {
                                       "points" : "}ff_HlplH]pAGV"
                                    },
                                    "start_location" : {
                                       "lat" : 47.2230275,
                                       "lng" : -1.5439104
                                    },
                                    "travel_mode" : "WALKING"
                                 }
                              ],
                              "travel_mode" : "WALKING"
                           }
                        ],
                        "traffic_speed_entry" : [],
                        "via_waypoint" : []
                     }
                  ],
                  "overview_polyline" : {
                     "points" : "q_c_HvopHQPM@u@p@iAbA[^KZg@b@}AtA_@ZaBrAMPSj@O`@OT`@tB@cASgAkD}Pg@{Bg@eBgAsDiBuGmAgEq@}Ac@{@y@sAgBiCk@}A{@qCaByFOq@u@eEa@eDsAmKi@qCq@sDYwA_@qAk@{Au@cB]eAm@oBsEgOMi@WsAYgCOkCAWJAEBASE[SFIDEc@QJAD]SK^Gl@CBGJOXUV[RSFSAQGy@m@e@KUCAFcAt@{@p@[`@Uf@Od@cA~@o@r@U_ACFq@nAc@~@AFg@UiC}@_A_@]pAGV"
                  },
                  "summary" : "",
                  "warnings" : [
                     "Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths."
                  ],
                  "waypoint_order" : []
               }
            ],
            "status" : "OK"
         })
    })
});