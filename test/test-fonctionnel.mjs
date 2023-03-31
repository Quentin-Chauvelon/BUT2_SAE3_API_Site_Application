"use strict"

import assert from "joi";
import { Room } from "../model/room.mjs";


//TODO  Tests Models 
// room

describe('Models',function() {

    describe("room", function() {

        //Construction de l'objet
        it("constructs", function() {
          const room = Room(1,"bruh",true)
          assert.equal(room,
            {
                id: 1,
                name: "bruh",
                computerRoom: true
            });
        });

        //Construction de l'objet
        it("gets the url", function() {
            const room = Room(1,"bruh",true)
            assert.equal(room,
              {
                  id: 1,
                  name: "bruh",
                  computerRoom: true
              });
          });
    
      });
  
      
});

