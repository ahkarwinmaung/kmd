
# DB Structure

- User
    - UserID [int - 11]
    - Role (admin/user) [varchar - 10]
    - Name [varchar - 40]
    - Email [varchar - 40]
    - Phone [varchar - 40]
    - Photo (avatar image url) [varchar - 255]
- Item
    - ItemID [int - 11]
    - AuthorName [varchar - 40]
    - ItemName [varchar - 255]
    - Description [text]
    - ThumbnailImage (image url) [varchar - 255]
    - ReleaseDate [DateTime]
    - PublishStatus (true/false) [varchar - 10]
    - Category -> CategoryID [int - 11]
- Category
    - CategoryID [int - 11]
    - Name [varchar - 50]
- SubItem (episodes)
    - SubID [int - 11]
    - Name [varchar - 50]
    - Item - ItemID [int - 11]
- SubItemImages
    - SubItem -> SubID [int - 11]
    - ImageUrl [varchar - 255]
- Feedbacks
    - User -> UserID [int - 11]
    - Item -> ItemID [int - 11]
    - Description [text]



# Frontend pages
<!-- Admin  -->
1 Admin login
2 create new Item
3 add SubItems (repeater form)
4 manage items (list table)
    delete button (soft delete)

<!-- User -->
5 User Register
6 User Login
7 Home page
    - listing (group by category) https://mangaplaza.com/
8 Listing page
    - search (keyword search by item -> name) [ajax]
9 Category Listing page
    - listing https://mangaplaza.com/listing/48/
10 Detail page https://mangaplaza.com/title/0303000003/?content_id=103030000030001
    - detail banner
    - list of SubItems
    - list of feedbacks
    - new feedback form (textarea field, submit button) [ajax]