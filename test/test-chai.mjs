import {init} from '../server.mjs'
import chai from 'chai'
import chaiHttp from 'chai-http'

let should = chai.should()
chai.use(chaiHttp)

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
                    "id": 89804,
                    "name": "C0/05",
                    "computerRoom": false
                },
                {
                    "id": 89806,
                    "name": "C0/02",
                    "computerRoom": true
                }
            ])
        });
    });
    //schedules
    describe('/populate/schedules', () => {
        it("must show schedules", async () => {
            const res = await server.inject({
                        method: 'get',
                        url: '/populate/schedules'
                    });
                    chai.expect(res.statusCode).to.equal(200);
                    chai.expect(res.result).to.be.eql([
                        {
                            "id": 3182,
                            "name": "INFO 2 Groupe 4"
                        },
                        {
                            "id": 3183,
                            "name": "INFO 2 TP 1-1"
                        },
                        {
                            "id": 3184,
                            "name": "INFO 2 TP 1-2"
                        }
                    ])
                });
        });

        describe('/populate/teachers', () => {
            it('must show teachers', async () => {
    
                const res = await server.inject({
                    method: 'get',
                    url: '/populate/teachers'
                });
                chai.expect(res.statusCode).to.equal(200);
                chai.expect(res.result).to.be.eql([
                    {
                      "id": 2208,
                      "name": "Arnaud LANOIX"
                    },
                    {
                      "id": 360071,
                      "name": "Jean-François Berdjugin"
                    }
                  ])
            });
        });


    it("must show 400 - error", async () => {
        const res = await server.inject({
                    method: 'get',
                    url: '/populate/bruh'
                });
                chai.expect(res.statusCode).to.equal(400);
                chai.expect(res.result).to.be.eql({message: 'error'})
            });

    it("must show 404 - not found", async () => {
        const res = await server.inject({
                    method: 'get',
                    url: '/populate/salut/atous'
                });
                chai.expect(res.statusCode).to.equal(404);
            });
});
        
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
                "start": "[Date : 2023-03-30T09:35:00.000Z]",
                "end": "[Date : 2023-03-30T12:30:00.000Z]",
                "summary": "TD - PROJET PERSONNEL ET PROFESSIONNEL\\, GEA1 Promo\\, GODARD Claudio",
                "location": "J-Amphi 1\\, J-C0/05\\, J-D0/02\\, J-D1/12\\, J-D2/23\\, J-E0/01\\, J-E1/12\\, J-E1/16\\, J-Salle du Conseil",
                "roomId": 0
            }
        ]);
    });
    */

    it('should show room class of C0-05 at 30/10/2023 at 8:30 am and it has no class', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/89804/20230330T083000000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])

    });

    it('should show room class of C0-04 at 30/10/2023 at  15:20 and it has no class at this time', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/20230330T15200000Z'
        });
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.result).to.be.eql([])
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
            url: '/room/0000/20230330T15200000Z'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({
            message : 'not found'
        })
    });

    it('should show empty because the date is negative ', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/-20230330T15200000Z'
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

    it('should show 404 because of bad params', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/room/1301/20230330T15200000Z/yooo'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({
            message : "not found"
        })
    });
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
            url: '/rooms/false/20230330T15200000Z'
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
              "id": 89804,
              "name": "C0/05",
              "computerRoom": false
            }
          ])
    });

    it('should show all empty computer rooms on the given date', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230330T15200000Z'
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
            }
          ])
    });

    it('should show empty because there are no empty rooms', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230330T11420000Z'
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

    it('should show 404 because of bad params', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/rooms/true/20230/yooo'
        });
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.result).to.be.eql({
            message : "not found"
        })
    });
});


/// TODO Tests Schedule

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
        

        it('should show 404 because the room does not exist', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/0000/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([])
        });

        it('should show error ? and the schedule of the room ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/1300/20230330'
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({
                message : "date invalide"
            })
        });

        it('should show the schedule of the room C0/03 for the day', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/1300'
            });
            chai.expect(res.statusCode).to.equal(200);
        });

        it('should show the schedule of the room on the given day', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/day/1300/20230330T15200000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql([
                {
                  "start": formatStringToDate('2023-03-30T08:00:00.000Z'),
                  "end": formatStringToDate('2023-03-30T10:00:00.000Z'),
                  "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 3",
                  "location": "J-C0/03",
                  "roomId": 0
                },
                {
                  "start": formatStringToDate('2023-03-30T10:10:00.000Z'),
                  "end": formatStringToDate('2023-03-30T12:20:00.000Z'),
                  "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 4",
                  "location": "J-C0/03",
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
    
        it('should show 404 because the room does not exist', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/0000/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.result).to.be.eql({
                message : "not found"
            })
        });

        it('should show error ? and the schedule of the room ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/1300/20230330'
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({
                message : "error"
            })
        });

        it('should show error ? and the schedule of the room ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/1300/20230330'
            });
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.result).to.be.eql({
                message : "error"
            })
        });
        it('should show the schedule of the room C0/03 for the week', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/1300'
            });
            chai.expect(res.statusCode).to.equal(200);
        });

        it('should show the not found because the params are not correct', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/1300/20230330T11420000Z/bruh'
            });
            chai.expect(res.statusCode).to.equal(200);
        });

        it('should show the schedule of the week for the room C0/03', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/schedule/week/1300/20230330T11420000Z'
            });
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(res.result).to.be.eql(            
                [
                    [],
                    [
                      {
                        "start": "[Date : 2023-03-27T09:30:00.000Z]",
                        "end": "[Date : 2023-03-27T10:50:00.000Z]",
                        "summary": "TP - Exploitation BD_R2\\, INFO 1 TP 1-2\\, NACHOUKI Gilles",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-27T11:00:00.000Z]",
                        "end": "[Date : 2023-03-27T12:20:00.000Z]",
                        "summary": "TP - Exploitation BD_R2\\, INFO 1 TP 1-2\\, NACHOUKI Gilles",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-27T13:30:00.000Z]",
                        "end": "[Date : 2023-03-27T14:50:00.000Z]",
                        "summary": "TD - Services réseau\\, INFO 1 Groupe 2\\, HERNANDEZ Nicolas",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-27T15:00:00.000Z]",
                        "end": "[Date : 2023-03-27T16:20:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 2-1\\, HERNANDEZ Nicolas",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-27T16:30:00.000Z]",
                        "end": "[Date : 2023-03-27T17:50:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 2-2\\, HERNANDEZ Nicolas",
                        "location": "J-C0/03",
                        "roomId": 0
                      }
                    ],
                    [
                      {
                        "start": "[Date : 2023-03-28T08:00:00.000Z]",
                        "end": "[Date : 2023-03-28T09:20:00.000Z]",
                        "summary": "TD - Communication professionnelle\\, INFO 1 Groupe 1\\, CAZALAS Sebastien",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-28T09:30:00.000Z]",
                        "end": "[Date : 2023-03-28T10:50:00.000Z]",
                        "summary": "TD - Services réseau\\, INFO 1 Groupe 1\\, REMM Jean-François",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-28T11:00:00.000Z]",
                        "end": "[Date : 2023-03-28T12:20:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 1-2\\, REMM Jean-François",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-28T15:00:00.000Z]",
                        "end": "[Date : 2023-03-28T16:20:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 1-1\\, REMM Jean-François",
                        "location": "J-C0/03",
                        "roomId": 0
                      }
                    ],
                    [
                      {
                        "start": "[Date : 2023-03-29T13:30:00.000Z]",
                        "end": "[Date : 2023-03-29T14:50:00.000Z]",
                        "summary": "TD - Services réseau\\, INFO 1 Groupe 3\\, BOUTIN Olivier",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-29T15:00:00.000Z]",
                        "end": "[Date : 2023-03-29T16:20:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 3-1\\, BOUTIN Olivier",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-29T16:30:00.000Z]",
                        "end": "[Date : 2023-03-29T17:50:00.000Z]",
                        "summary": "TP - Services réseau\\, INFO 1 TP 3-1\\, BOUTIN Olivier",
                        "location": "J-C0/03",
                        "roomId": 0
                      }
                    ],
                    [
                      {
                        "start": "[Date : 2023-03-30T08:00:00.000Z]",
                        "end": "[Date : 2023-03-30T10:00:00.000Z]",
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 3",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-30T10:10:00.000Z]",
                        "end": "[Date : 2023-03-30T12:20:00.000Z]",
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 4",
                        "location": "J-C0/03",
                        "roomId": 0
                      }
                    ],
                    [
                      {
                        "start": "[Date : 2023-03-31T09:30:00.000Z]",
                        "end": "[Date : 2023-03-31T10:50:00.000Z]",
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 4",
                        "location": "J-C0/03",
                        "roomId": 0
                      },
                      {
                        "start": "[Date : 2023-03-31T11:00:00.000Z]",
                        "end": "[Date : 2023-03-31T12:20:00.000Z]",
                        "summary": "TD - Développement d'une application complexe (parc. REAL)\\, INFO 2 Groupe 4",
                        "location": "J-C0/03",
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



    
});


//TODO Tests /user

describe('/user', () => {
    let server

    // TODO Tests route /user/favoriteSchedule
    describe('/user/favoriteSchedule', () => {

        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        

    });
    // TODO Tests route /user/favoriteSchedule/{token}
    describe('/user/favoriteSchedule/{token}', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        
    });

    // TODO Tests route /user/login
    describe('/user/login', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        
    });
    // TODO Tests route /user/register
    describe('/user/register', () => {
        
        beforeEach(async () => {
            server = await init();
    
        });
    
        afterEach(async () => {
            await server.stop();
        });
    
        
    });
});