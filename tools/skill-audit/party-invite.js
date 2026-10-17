await game.evaluate(()=>{const t=window.__fourthTest;const p=new t.packet.CZ.PARTY_JOIN_REQ();p.characterName='AutoTest';t.network.sendPacket(p);});return {sent:true};
