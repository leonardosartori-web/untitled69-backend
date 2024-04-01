const {connect} = require("./database");
const {user} = require("./models/User");
const {lesson} = require("./models/Lesson");

connect(() => {});

const main = async function () {
    /*user.methods.add({name: "Leonardo", surname: "Ciao", email: "leon"}).then(u => {
        u
    });*/
    /*user.methods.find({name: "Leonardo", surname: "Ciao", email: "leonardo"}).then(u => {
        console.log(u);
    })*/

    /*lesson.methods.add({teacher: "Leonardo", students: ["Leo", "Anita"], date: new Date()}).then(l => {
        console.log(l);
    })*/

    //await user.methods.add({fullname: "Leonardo", email: "leonardo"});

    const data = {fullname: "Leonardo Sartori", email: "leonardo.sartori62@gmail.it", role: "admin", password: "abc"};
    await user.methods.add(data);

    //const u = await user.methods.findOne({fullname: "Leonardo", email: "leonardo"});

    /*try {
        await u.addLesson({students: ["Leo", "A", "B"], date: new Date()});
    } catch (e) {
        console.error(e);
    }*/

    //await u.updateLesson({date: new Date("2024-03-30T10:01:24.678+00:00")}, {date: new Date()});

    //await u.deleteLesson({_id: "66072ec4c676c007f0cc3dbb"});

}

main();

