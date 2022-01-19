# AlexandriaV2

0. Disclaimer
1. Overview
2. The story of Alexandria
3. Features
4. Stack details
5. Framework list

***--- DISCLAIMER / LEGAL NOTICE ---***

> Please note that this project is not intended to be installed on any machine other than the creator.
> The repository is only public for the purposes of showcase.
> Neither QuirinusTech nor its subsidiaries and/or affialites will be held liable for any damage or loss of any nature, howsoever arising, whether as a result of the usage of any of the code contained in this repository or by duplication thereof for any reason whatsoever.
> ***THE USAGE OF ANY CODE IN THIS REPOSITORY IS DONE SOLELY AT THE USER'S OWN RISK!***


***1. Overview***

*Alexandria* (Formerly the "Library of Alexandria") is a tool for managing a media centre (as was its namesake) for users to request movies and series.

A slightly more detailed description of functionalities, frameworks and stacks included follows below.
Known issues, future features and per-release patch notes listed in PatchNotes folder.

Media Information supplied through integration with the OMDB and TvMaze API's.
Styling was ported from Alexandria V1.
Please see the 'About' page for full list of aknowlegements.

The user experience is intended for mobile view, while the admin tools are best viewed on a desktop.

Developed in *Visual Studio Code*.


***2. The story of Alexandria***

Alexandria was originally written as its creator's first full-stack project in jQuery & Jinja Templating with a Python/Flask back-end and an SQL database back in 2019.
Version 2 of Alexandria first went live in June 2021 after several months of development as a revival with a more intuitive UI and a plethora of new features, ported to React with Node/Express backend and a Firebase database.

Since then, over multiple iterations, the available features have grown and the repo is now well over 50'000 lines of code.

Development on Alexandria is still ongoing and features are still being refined, added and removed daily.

> It is impossible to put an exhaustive list of all the various functions and utilities included.
> For a live demo or for any queries, please contact me directly at:
> ***quirinustech@gmail.com***


***3. Features***

From the user's perspective, they log in and request media by searching with a title or imdbId.
  - Register an account
  - Log in / out (Managed with JWT)
  - Reset Password
  - Add new entry to wishlist
  - Optional auto-update feature, high-priority flagging and the range of episodes (if series).
  - Modify certain aspects and/or delete/blacklisting of existing entries in the wishlist
  - Each wishlist is unique to each user, so the user only sees their own wishlist.

From the Admin's perspective, a comprehensive tool for managing the user's wishlist is provided via the AdminCMS page, divided into four segments:
 1. Wishlist:
  + Wishlist CMS
    - Direct interaction with the wishlist data via a UI created in React.
    - Virtually all information can be modified
    - Standard read, update and delete actions are supported.
    - Includes filters, searchbar and column sorting
  + Add New
    - Create action supported, with all aspects of the data customisable.
    - There is also the option to import data in JSON format
    - Media information available via API
 2. Message Centre
  + Notifications CMS
    - Modify / Delte existing notifications.
  + New Message
    - Create new messages with custom properties
  + Msg Centre Preview
    - Allows the admin to see a preview of what messages the user will see when the next log in.
 3. User Manager Console
  + User Manager
    - De/activate accounts
    - Modify user privileges
    - manually reset password via e-mail
  + Blacklist manager
    - The blacklist is a list of media that the user has indicated they want to restrict from their view.
    - The Blacklist Manager is a CMS for that blacklist on a per-user basis.
 4. Workflow
  + Intelligently parses the existing wishlist and identifies where admin action is required.
  + Integration with external API's provide additional information on new episode release dates
  + Bulk action mode option can be toggled for quicker processing


***4. Stack***
 - Database: ***Cloud Firestore***
 - Server: **NodeJS / Express**
 - Client: **React**


***5. Frameworks used***
 * Server
    - Node-fetch
    - Nodemailer
    - Dotenv
    - bcrypt
 * Client
    - Formik
    - Framer-motion
    - js-cookie
    - React Router