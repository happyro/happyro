await game.evaluate(()=>{const t=window.__fourthTest;t.network.sendPacket(new t.packet.CZ.CANCEL_LOCKON());t.session.moveAction=null;});return {stopped:true};
