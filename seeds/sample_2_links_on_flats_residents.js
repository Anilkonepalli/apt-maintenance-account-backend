
let sampleData = [
  {
    blockNumber: 'NW',
    flatNumber: 'G1',
    residents: [ {firstName: 'Hari' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'NW',
    flatNumber: 'G2',
    residents: [ {firstName: 'Prabhu' , lastName: ''} ]
  },
  {
    blockNumber: 'NE',
    flatNumber: 'G3',
    residents: [ {firstName: 'Pretina' , lastName: 'David'} ]
  },
  {
    blockNumber: 'NE',
    flatNumber: 'G4',
    residents: [ {firstName: 'Mohankumar' , lastName: 'A R'}, {firstName: 'Ganesh' , lastName: ''}  ]
  },
  {
    blockNumber: 'SE',
    flatNumber: 'G5',
    residents: [ {firstName: 'Jerry' , lastName: ''} ]
  },
  {
    blockNumber: 'SE',
    flatNumber: 'G6',
    residents: [ {firstName: 'Unknown' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'SW',
    flatNumber: 'G7',
    residents: [ {firstName: 'Sridhar' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'SW',
    flatNumber: 'G8',
    residents: [ {firstName: 'Srinivas' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'NW',
    flatNumber: 'F1',
    residents: [ {firstName: 'Muthukumar' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'NW',
    flatNumber: 'F2',
    residents: [ {firstName: 'Unknown' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'NE',
    flatNumber: 'F3',
    residents: [ {firstName: 'Arunkumar' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'NE',
    flatNumber: 'F4',
    residents: [ {firstName: 'Mohankumar' , lastName: 'A R'} ]
  },
  {
    blockNumber: 'SE',
    flatNumber: 'F5',
    residents: [ {firstName: 'Unknown' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'SE',
    flatNumber: 'F6',
    residents: [ {firstName: 'Jayakumar' , lastName: ''} ]
  },
  {
    blockNumber: 'SW',
    flatNumber: 'F7',
    residents: [ {firstName: 'Ezhilmani' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
  {
    blockNumber: 'SW',
    flatNumber: 'F8',
    residents: [ {firstName: 'Kannan' , lastName: ''}, {firstName: 'Unknown' , lastName: ''}  ]
  },
];

let tableName = 'flats_residents';
let sourceTable1 = 'flats';
let sourceTable2 = 'residents';
let flats;
let residents;

exports.seed = function(knex, Promise) {

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(getFlats) // get all rows of Flats table
    .then(getResidents) // get all rows of Residents tables
    .then(addSamples);

  function getFlats() {
    return knex.select('id', 'block_number', 'flat_number').from(sourceTable1);
  }
  function getResidents(rows) {
    flats = rows;
    // console.log('Flats: '); console.log(rows);
    return knex.select('id', 'first_name', 'last_name').from(sourceTable2);
  }
  function addSamples(rows){
    residents = rows;
    // console.log('users: '); console.log(rows);
    let links = [];
    let link;
    let fid;
    let rid;
    sampleData.forEach(obj => {
      fid = getFlatIdFor(obj.blockNumber, obj.flatNumber);
      // console.log('Flat id: '); console.log(fid);
      if(fid) {
        obj.residents.forEach(eachResident => {
          rid = getResidentIdFor(eachResident.firstName, eachResident.lastName);
          // console.log('Resident id: '); console.log(rid);
          if(rid) {
            link = knex(tableName).insert({flat_id: fid, resident_id: rid});
            links.push( link );
          }
        });
      }

    });
    return Promise.all(links);
  }

  function getFlatIdFor(block, flat){
    let fFlats = flats.filter(each => each.block_number === block && each.flat_number === flat);
    // console.log('Flat..'); console.log(fFlats);
    if(fFlats.length < 1) {
      return null
    }
    return fFlats[0].id;
  }
  function getResidentIdFor(first, last) {
    let fResidents = residents.filter(each => each.first_name === first && each.last_name === last);
    // console.log('Resident..'); console.log(fResidents);
    if(fResidents.length < 1) {
      return null
    }
    return fResidents[0].id;
  }

}
