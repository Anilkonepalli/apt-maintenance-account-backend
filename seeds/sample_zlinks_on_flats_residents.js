
let linkTable = 'flats_residents';
let sourceTable = 'users';
let targetTable1 = 'residents';
let targetTable2 = 'flats';
let users;
let flats;
let residents;
let links;

exports.seed = function(knex, Promise) {

  getUsers()
    .then(getResidents) // get all rows of Residents tables
    .then(getLinks)
    .then(getFlats);
    .then(updateOwnerIds);

  function getUsers() {
    return knex.select('id', 'first_name', 'last_name').from(sourceTable1);
  }
  function getResidents(rows) {
    users = rows;
    // console.log('Users: '); console.log(rows);
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
      obj.residents.forEach(eachResident => {
        rid = getResidentIdFor(eachResident.firstName, eachResident.lastName);
        // console.log('Resident id: '); console.log(rid);
        link = knex(tableName).insert({flat_id: fid, resident_id: rid});
        links.push( link );
      });
    });
    return Promise.all(links);
  }

  function getFlatIdFor(block, flat){
    let fFlats = flats.filter(each => each.block_number === block && each.flat_number === flat);
    // console.log('Flat..'); console.log(fFlats);
    return fFlats[0].id;
  }
  function getResidentIdFor(first, last) {
    let fResidents = residents.filter(each => each.first_name === first && each.last_name === last);
    // console.log('Resident..'); console.log(fResidents);
    return fResidents[0].id;
  }

}
