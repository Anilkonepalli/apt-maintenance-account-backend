// Updates OwnerIDs in Flats and Residents tables
//

var linkTable = 'flats_residents';
var sourceTable = 'users';
var targetTable1 = 'residents';
var targetTable2 = 'flats';
var users;
var flats;
var residents;
var links;

exports.seed = function(knex, Promise) {

  return getUsers()
    .then(getResidents) // get all rows of Residents tables
    .then(getFlats)
    .then(getLinks)
    .then(updateOwnerIds);

  function getUsers() {
    return knex.select('id', 'first_name', 'last_name').from(sourceTable);
  }
  function getResidents(rows) {
    users = rows;
    // console.log('Users: '); console.log(rows);
    return knex.select().from(targetTable1);
  }
  function getFlats(rows){
    residents = rows;
    // console.log('Residents: '); console.log(rows);
    return knex.select().from(targetTable2)
  }
  function getLinks(rows){
    flats = rows;
    // console.log('Flats: '); console.log(rows);
    rids = residents.map(each => each.id);
    return knex.select().from(linkTable);
  }
  function updateOwnerIds(rows){
    links = rows;
    // console.log('Links: '); console.log(rows);
    let userId;
    let results = [];
    let uresident;
    let uflat;
    let firstName;
    let lastName;
    residents.forEach(eachResident => {
      // console.log('User Id: '); console.log(userId);
      firstName = eachResident.first_name;
      lastName = eachResident.last_name;
      userId = getUserId(firstName, lastName);
      if(userId) {
        uresident = updateResident(eachResident.id, userId);
        results.push( uresident );
        uflat = updateFlat(eachResident.id, userId);
        if(uflat) {
          results.push( uflat );
        }
      }
    });
    return Promise.all(results);
  }

  function getUserId(fname, lname){
    let fusers = users.filter(eachUser =>
      eachUser.first_name === fname
    && eachUser.last_name === lname);

    // console.log('eachResident...'); console.log(eachResident);
    // console.log('fusers: '); console.log(fusers);
    if(fusers.length < 1) {
      return null
    }
    return fusers[0].id;
  }

  function updateResident(rid, uid){
    return knex(targetTable1)
      .where('id', '=', rid)
      .update({
        owner_id: uid
      });
  }

  function updateFlat(rid, uid){
    // console.log('rid: '+rid+'; uid: '+uid);
    let flinks = links.filter(eachLink => eachLink.resident_id === rid);
    let fid = flinks[0].flat_id;
    // console.log('fid: '+fid);
    let flat = flats.filter(eachFlat => eachFlat.id === fid);
    // console.log('Flat: '); console.log(flat);
    if(flat[0].owner_id !== 0) return null;
    return knex(targetTable2)
      .where('id', '=', fid)
      .update({
        owner_id: uid
      });
  }

}
