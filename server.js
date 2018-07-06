db.students.aggregate([{ $group: { _id: '$name', couter: { $sum: 1 } } }])
db.students.aggregate([{ $group: { _id: '$name', name: { $push: '$$ROOT' } } }])
db.students.aggregate([{ $group: { _id: '$name', counter: { $sum: 1 } } }, { $project: { _id: 0, counter: 1 } }])
for (var i = 0; i < 100000; i++) { db.st.insert({ 'name': 'test' + i }) }
db.st.find({ "name": "test99999" }).explain('executionStats')