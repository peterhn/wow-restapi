# wow-restapi
rest api test for blizzard application

asynchronous rest api using node.js and express
--
Only the rules specified in the notes were followed, the api assumes only correct input will be sent to the api (e.g. only horde/alliance factions, all classes listed in the rules, all races listed in the rules)

This api follows the following rules: 
•         Orc, Tauren, and Blood Elf races are exclusively Horde.
•         Human, Gnome, and Worgen races are exclusively Alliance.
•         Only Taurens and Worgen can be Druids.
•         Blood Elves cannot be Warriors.
•         A player can only have all Horde or all Alliance active characters.
•         A player should be able to delete and undelete characters.

The api has the following endpoints:

GET /about
  //returns information about rest api
POST /account
  //creates an account
  { name : "account_name" }
GET /account
GET /account/{account_name}
  //gets a list of accounts
POST /account/{account_name}/characters
  //creates a character for specified account
  { name : "character_name", race : "character_race", class : "character_class", faction : "character_faction", level : "character_level" }
DELETE /account/{account_name}
  //deletes an account
DELETE /account/{account_name}/{character_name}
  //marks characters as deleted or undeleted
