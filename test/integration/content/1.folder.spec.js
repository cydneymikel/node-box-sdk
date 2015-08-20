var async   = require('async');
var chai    = require('chai');
var expect  = chai.expect;

describe('Box Folder Operations', function() {
  var box = global.box;

  // POST Create Folder
  it('should create a folder', function(done) {
    var data = { name: 'BoxTest', parent: { id: 0 }};
    box.content.folder.create(data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('type', 'folder');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('name', data.name);

      global.folderId = res.body.id;
      global.options = { tokens: tokens };
      done();
    });
  });

  // PUT Update Folder
  it('should update a folder', function(done) {
    var data = { name: "BoxTestUpdate", description: "A box test folder" };
    box.content.folder.update(global.folderId, data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.folderId);
      expect(res.body).to.have.property('name', data.name);
      expect(res.body).to.have.property('description', data.description);
      expect(res.body).to.have.property('item_collection');
      
      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Folder Info
  it('should return a full folder object', function(done) {
    box.content.folder.get(global.folderId, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.folderId);
      expect(res.body).to.have.property('item_collection');
      
      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Folder Items
  it('should return a collection of items contained in the folder', function(done) {
    box.content.folder.items(global.folderId, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('entries');
      expect(res.body.entries).to.be.an('array');
      expect(res.body).to.have.property('order');

      global.options = { tokens: tokens };
      done();
    });
  });

  // PUT Create Link
  it('should create a shared link for a folder', function(done) {
    var data = { shared_link: { } };

    box.content.folder.share(global.folderId, data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.folderId);
      expect(res.body).to.have.property('type', 'folder');
      expect(res.body).to.have.property('shared_link');
      expect(res.body.shared_link).to.have.property('url');

      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Folder Collaborations
  it('should get a list of all the collaborations on a folder', function(done) {

    box.content.folder.collaborations(global.folderId, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('total_count');
      expect(res.body).to.have.property('entries');
      expect(res.body.entries).to.be.instanceof(Array);

      global.options = { tokens: tokens };
      done();
    });
  });

  // POST Copy Folder
  var copiedFolder;
  it('should copy a folder', function(done) {
    var data = { parent: { id : 0 }, name: "AnotherBoxTest" };
    box.content.folder.copy(global.folderId, data, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id');
      copiedFolder = res.body;

      expect(res.body).to.have.property('name', data.name);
      expect(res.body).to.have.property('item_collection');
      
      global.options = { tokens: tokens };
      done();
    });
  });

  // DELETE Folder
  it('should delete folder from box', function(done) {
    global.options.params = { recursive: true };
    box.content.folder.delete(global.folderId, global.options, function(err, res, tokens) {
      expect(res.statusCode).to.equal(204);

      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Trashed Items
  it('should get all items that have been moved to the trash', function(done) {
    box.content.folder.trash(null, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('total_count');
      expect(res.body).to.have.property('entries');
      expect(res.body.entries).to.be.instanceof(Array);

      global.options = { tokens: tokens };
      done();
    });
  });

  // GET Trashed Folder
  it('should get a specific item that has been moved to the trash.', function(done) {
    box.content.folder.trash(global.folderId, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.folderId);
      expect(res.body).to.have.property('type', 'folder');
      expect(res.body).to.have.property('item_status', 'trashed');

      global.options = { tokens: tokens };
      done();
    });
  });

  // POST Restore Folder
  it('should restore a folder from trash', function(done) {
    box.content.folder.restore(global.folderId, {}, global.options, function(err, res, tokens) {
      expect(res.body).to.have.property('id', global.folderId);
      expect(res.body).to.have.property('type', 'folder');
      expect(res.body).to.have.property('item_status', 'active');

      global.options = { tokens: tokens };
      done();
    });
  });

  // DELETE Permanently Delete Folder
  it('should permanently delete a folder', function(done) {
    async.series({
      remove: function(next) {
        box.content.folder.delete(copiedFolder.id, global.options, function(err, res, tokens) {
          global.options = { tokens: tokens };
          next(err, res);
        });
      },
      destroy: function(next) {
        box.content.folder.destroy(copiedFolder.id, global.options, function(err, res, tokens) {
          global.options = { tokens: tokens };
          next(err, res);
        });
      }
    }, function(err, result) {
      expect(result.remove.statusCode).to.equal(204);
      expect(result.destroy.statusCode).to.equal(204);

      done();
    });
  });

});

