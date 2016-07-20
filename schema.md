# Schema and tables
For each year for which a Northern Ireland Assembly election takes place

The directory layout and table schema are described below:

### contest
In the head directory, information on the election contest taking place, to provide comparability with other Assembly elections as well as working towards a common system for describing elections across the world.

|Name|Type|Description|
|----|----|-----------|
Contest ID|URI|A URI providing a unique identifier for the individual electoral contest|
Name|String|A name for the election, e.g. "UK Parliamentary Election 2015"|
Election Type|String|The type of election. This should ideally draw from a controlled vocabulary|
Electoral System|String|Identifies the electoral system being used in the election. Ideally this should draw from a controlled vocabulary|
Start Date|Date|The date on which the electoral contest begun (i.e. voting day)|
End Date|Date|The date on which the electoral contest ended. Some contests run for a single day, in which case the start and end dates will be the same|


## /NI
Tables covering all constituencies, political parties and candidates standing across all eligble electoral areas.

### constituencies
Identifiers for all constituencies in election

|Name|Type|Description|
|----|----|-----------|
|Constituency_Number|URI|{key} unique ID number given to each constituency, based on NI Assembly Open Data codes|
|Constituency_Name|String|Full (official) name|
|ONS_Code|URI|Office of National Statistics identifying code for the analogous Westminster Parliamentary Constituency 
|Constituency_Code|URI|Abbreviation of constituency name (generally 2-letter, but 3-letter in case of Newry & Armagh: NYA)|
|Constituency_Directory|String|Constituency name in the /constituency directory|

### parties
Identifiers for all political parties (N.B. there is a 'party' for Independent candidates).

|Name|Type|Description|
|----|----|-----------|
|Party_Id|URI|{key} unique ID number given to each party|
|Party_Name|String|Political party title|
|Party_Abbreviation|String|Short acronym for party|
|Hex_Col|String|6-digit html color code|

## /constituency
Each constituency has its own Directory within in /constituency, matching those in that in NI/constituencies.csv (above), each with the following set of tables.
### /[Constituency_Directory]/Candidates
Candidate information for the constituency

|Name|Type|Description|
|----|----|-----------|
|Constituency_Name|String|As with the NI/constituencies table|
|Constituency_Number|URI|As with the NI/constiteuncies table|
|Candidate_Id|URI|{key} unique ID number given to each candidate|
|Firstname|String|Candidate's first name|
|Surname|String|Candidate's surname|
|Outgoing_Member|String|If the member was an incumbent MLA at the end of the previous Assembly mandate ('1' true; '0' false)|
|Party_Id|URI|As with the NI/parties table|
|Party_Name|String|As with the NI/parties table|
|Photo_URL|URI|Link to the candidate's profile picture|
|Constituency_Directory|String|As with the NI/constituencies table|
|Gender|String|[M]Male/[F]Female/[O]Other|

### /[Constituency_Directory]/ConstituencyCount
Headline data on polling in the constituency.

|Name|Type|Description|
|----|----|-----------|
|Constituency_Number|URI|{key} As with the NI/constituencies table|
|Total_Poll|Integer|Total number of votes cast|
|Spoiled|Integer|Total number of invalid votes|
|Valid_Poll|Integer|Total number of valid votes to be counted =(Total_Poll - Spoiled)|
|Quota|Integer|Pass mark for total number of votes to be elected in any stage|
|Total_Electorate|Integer|Total number of eligible voters|
|Number_Of_Seats|Integer|Number of seats to be filled in constituency|
|Constituency_Code|URI|As with the NI/constituencies table|
|Voting_Age_Pop|Integer|Total population aged 18+ (n.b. some may not be entitled to vote due to residency status)|

### /[Constituency_Directory]/Count
The results for each candidate and each count stage, representing the Single Transferable Vote system. Note that there is no {key} value (as the Candidate_Id will appear more than once), but that a number of keys from other tables are included. There is a row for each candidate at each count stage, even if they have already been excluded from the process.

|Name|Type|Description|
|----|----|-----------|
|Constituency_Number         |URI| As with the NI/constituences table|
|Candidate_Id                |URI| As with the [Constituency_Directory]/Candidates table|
|Count_Number                |Integer| Runs sequentially from 1 to the final count stage number|
|Firstname                   |String| As with the [Constituency_Directory]/Candidates table|
|Surname                     |String| As with the [Constituency_Directory]/Candidates table|
|Candidate_First_Pref_Votes  |Integer| Number of First Preference Votes received by each candidate. The same value for each candidate should be present in each Count_Number as this does not change|
|Transfers                   |Float| The number of transfers received after the first stage (in Count_Number: 1 this will be 0). Can be negative when votes are transferred from a candidate due to exclusion or exceeding the quota|
|Total_Votes                 |Float| The total number of votes that have been amassed by the candidate at the current count number =(Candidate_First_Pref_Votes + the sum of all Transfers at previous and current stages)|
|Status                      |String| If the candidate has been elected or excluded in this or any previous stage. ('Elected', 'Excluded' or null)|
|Occurred_On_Count           |Integer| Count_Number that the change in status occured (even if it was on a previous count)|
|Party_Name                  |String| As with [Constituency_Directory]/Candidates table|

### /[Constituency_Directory]/NonTransferable
|Name|Type|Description|
|----|----|-----------|
|Constituency_Number|URI|As with /NI/constituencies table|
|Count_Number|Integer|As with /[Constituency_Directory]/Count table (this will not include 1 as no votes will be transferred at this stage)|
|Non_Transferable|Float|Number of votes not transferred to a candidate|
