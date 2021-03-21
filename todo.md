Development of a private torrent (ratio system to download) site with features similar to Yggtorrent (https://yggtorrent.li/ - French torrent site) with more features, you can get inspiration from this site to get an idea of what is expected

General Listings :

- Torrent search with advanced Criteria
  (For all the listings we can order the torrents by Completed, Seeders, Leechers, Date added etc)
- Listing torrent of the day
- Listing torrent of the week
- Listing torrent of the month
- Most seeded torrents
- Latests torrents
- Listing torrents by Category
- Exclusives torrents
- Top 100 (Most downloaded torrents)
  Torrents:
- Torrent upload/edit
- Different status : (active : visible for all , under_validation: wait to be validated by a validator, blocked : something has to be corrected to be under_validation again, refused : can't be accepted, does not fit in acceptance criteria)
- When user upload torrent, it can be linked to any movie API to grab the details to have a rich description (movie cover, trailer etc) - it can be usefull also to organize the torrents : list torrents episodes of a tvseries etc...
- Download .torrent file (logic lol)
- Report torrent to the Staff and specify reason
- Add torrent to favourites/delete from favourites
- Create organized list of torrents grouped by thematic that users can share via a public link
- Rate the torrent +1/-1
- Add/Edit/Delete comment to a torrent
  Users :
- It's a private Tracker : Users have to keep a good Ratio (download/upload > 1) to be able to download, otherwise the account is locked => no possible to download (we'll use xbt_tracker : https://github.com/OlafvdSpek/xbt)
- Public profile with possibility to see user details (certains fields, latest active date etc) display latest torrents uploaded, favourites torrents, created torrents list, latest comments.
- Update profile fields : Avatar, Email, Location, Gender, Profile description (only email cannot be updated)
- Can report a user (example : porn avatar)
- Can follow any user and get notified when the user upload a new torrent
- Blacklist : Can add users to banlist, to prevent them to send PM or to Follow etc.
- Favourites torrents management
- Subscriptions management
- Torrents download history
- Advanced messaging system
- Live notification system : once it triggers some events (if someone comment user torrents, if user receive sanction, if team validate torrent, block torrents)
- Settings management (Example : Appear invisible to hide latest active date, disabled torrent history, disable Adult torrents, Anonymous upload etc)
- Trophy system : Unblock trophy in function of contribution (for example : trophy for 10 comments, 10 torrents etc)
- Réputation system (have to find how to manage it - example : if someone rate +1 a torrent uploaded by the user, it give him reputation)
- Management Differents Ranks : User, Uploader (more than 25 torrents uploaded approved - don't require torrents to be validated to be active) Moderator (manage users: comments for example, ban etc), Validator (manage only torrents), Admin (manage all)
  Management :
  it is possible to manage everything via the manager in function of the rank.
- Validator users can manage only torrents content
  - Edit torrents/entire hand on torrents content
  - Change status of a torrent and specify the reason (example : put status "blocked" and specify reason why => user will be notified via notification system and will be able to correct the torrent according the reason)
  - Manage torrents related reports
- Moderators users can manage only users.
  - Ban / Period ban with reason of ban
  - Edit user details
  - Manage user related reports
- Actions logging : every staff action is logged : if someone edited profile of someone, it's displayed on the manager including the edited details, same for torrents edition etc
- Admin users can manage everything
- Every torrent uploaded by a no-uploader users has to be verified and approved
