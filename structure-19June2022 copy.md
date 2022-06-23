
# DB Structure
FYI - **TABLE_NAME** | [FIELD_NAME] | {FIELD_TYPE} | (FIELD_VALUE)

**Users**
    [ID] {int - 11}
    [Role] {varchar - 10} (admin/user)
    [Name] {varchar - 40}
    [Email] {varchar - 40}
    [Phone] {varchar - 40}
    [Image] {varchar - 255} (avatar image url)

**Items**
    [ID] {int - 11}
    [Name] {varchar - 255}
    [Description] {text}
    [Thumbnail] {varchar - 255} (image url)
    [AuthorName] {varchar - 40}
    [ReleaseDate] {Date}
    [PublishStatus] {varchar - 10} (true/false)
    [CategoryID] {int - 11} (**Category** -> [ID])

**Categories**
    [ID] {int - 11}
    [Name] {varchar - 50}

**SubItems** (Episodes)
    [ID] {int - 11}
    [Name] {varchar - 50]
    [Thumbnail] {varchar - 255} (image url)
    [ItemID] {int - 11} (**Items** -> [ID])

**SubItemImages**
    [ID] {int - 11}
    [Image] {varchar - 255}
    [SubItemID] {int - 11} (**SubItems** -> [ID])

**Feedbacks**
    [ID] {int - 11}
    [Description] {text}
    [UserID] {int - 11} (**Users** -> [ID])
    [ItemID] {int - 11} (**Items** -> [ID])



# Frontend pages
**Admin**
[AungMyintMyat], [AungShweMoe], [NyanLinHtet], [ThantNyiLin], [YeMinOak]
1. Admin login - []
2. create new Item - []
3. add SubItems (repeater form) - []
4. manage items (list table) - []
    delete button (soft delete)

**User**
5. User Register - [KyawKo]
6. User Login - [MinThuKyaw]
7. Home page [https://mangaplaza.com/] - [SiThu]
    - banner carousel
    - listing (group by category)
8. Listing page - [AungThantZin]
    - search (keyword search by **Items** -> [Name]) [ajax]
9. Category listing page [https://mangaplaza.com/listing/48/] - [AhKarWinMaung]
10. Detail page [https://mangaplaza.com/title/0303000003/?content_id=103030000030001] - [AhKarWinMaung]
    - detail banner (thumbnail, name, author)
    - list of **SubItems**
    - list of **Feedbacks**
    - new feedback form (textarea field, submit button) [ajax]