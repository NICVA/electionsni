# Schema and tables
For each election (e.g. a Northern Ireland Assembly election) the directory layout and table schema

## /NI
Tables covering all constituencies, political parties and candidates standing across all eligble electoral areas.

### constituencies
Identifiers for all constituencies in election

| Key                     | Description                                                                                             |
|-------------------------|---------------------------------------------------------------------------------------------------------|
| Constituency_Number     | {key} unique ID number given to each constituency, based on NI Assembly Open Data codes                 |
| Constituency_Name       | Full (official) name                                                                                    |
| ONS_Code                | Office of National Statistics identifying code for the analogous Westminster Parliamentary Constituency |
| Constituency_Code       | Abbreviation of constituency name (generally 2-letter, but 3-letter in case of Newry & Armagh: NYA)     |
| Constituency_Directory  | Constituency name in the /constituency directory                                                        |

### parties
Identifiers for all political parties (N.B. there is a 'party' for Independent candidates).

Key                 | Description
--------------------|------------------
Party_Id            | {key} unique ID number given to each party
Party_Name          | Political party title
Party_Abbreviation  | Short acronym for party
Hex_Col             | 6-digit html color code

## /constituency
Each constituency has its own Directory within in /constituency, matching those in that in NI/constituencies.csv (above), each with the following set of tables.
### /[Constituency_Directory]/Candidates
Candidate information for the constituency

| Key           | Description |
| --------------| ----------- |
| Constituency_Name | As with the NI/constituencies table  |
| Constituency_Number | As with the NI/constiteuncies table  |
| Candidate_Id  | {key} unique ID number given to each candidate  |
| Firstname | Candidate's first name  |
| Surname | Candidate's surname  |
| Outgoing_Member | If the member was an incumbent MLA at the end of the previous Assembly mandate ('1' true; '0' false)  |
| Party_Id  | As with the NI/parties table  |
| Party_Name  | As with the NI/parties table  |
| Photo_URL | Link to the candidate's profile picture  |
| Constituency_Directory | As with the NI/constituencies table  |
| Gender  | [M]Male/[F]Female/[O]Other  |

### /[Constituency_Directory]/ConstituencyCount
Headline data on polling in the constituency.

Key                 | Description
--------------------|------------
Constituency_Number | {key} As with the NI/constituencies table
Total_Poll          | Total number of votes cast
Spoiled             | Total number of invalid votes
Valid_Poll          | Total number of valid votes to be counted =(Total_Poll - Spoiled)
Quota               | Pass mark for total number of votes to be elected in any stage
Total_Electorate    | Total number of eligible voters
Number_Of_Seats     | Number of seats to be filled in constituency
Constituency_Code   | As with the NI/constituencies table

### /[Constituency_Directory]/Count
The results for each candidate and each count stage, representing the Single Transferable Vote system. Note that there is no {key} value (as the Candidate_Id will appear more than once), but that a number of keys from other tables are included. There is a row for each candidate at each count stage, even if they have already been excluded from the process.

Key                         | Description
----------------------------|------------
Constituency_Number         | As with the NI/constituences table
Candidate_Id                | As with the [Constituency_Directory]/Candidates table
Count_Number                | Runs sequentially from 1 to the final count stage number
Firstname                   | As with the [Constituency_Directory]/Candidates table
Surname                     | As with the [Constituency_Directory]/Candidates table
Candidate_First_Pref_Votes  | Number of First Preference Votes received by each candidate. The same value for each candidate should be present in each Count_Number as this does not change
Transfers                   | The number of transfers received after the first stage (in Count_Number: 1 this will be 0). Can be negative when votes are transferred from a candidate due to exclusion or exceeding the quota
Total_Votes                 | The total number of votes that have been amassed by the candidate at the current count number =(Candidate_First_Pref_Votes + the sum of all Transfers at previous and current stages)
Status                      | If the candidate has been elected or excluded in this or any previous stage. ('Elected', 'Excluded' or null)
Occurred_On_Count           | Count_Number that the change in status occured (even if it was on a previous count)
Party_Name                  | As with [Constituency_Directory]/Candidates table

### /[Constituency_Directory]/NonTransferable
Key                 | Description
--------------------|--------------
Constituency_Number | As with /NI/constituencies table
Count_Number        | As with /[Constituency_Directory]/Count table (this will not include 1 as no votes will be transferred at this stage)
Non_Transferable    | Number of votes not transferred to any other candidate
