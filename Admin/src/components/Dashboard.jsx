import React from 'react';

function Dashboard() {
  return (
    <div className='container-fluid container mt-5'>
      <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-hdd text-warning"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Number</p>
                    <h4 className="card-title">150GB</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="fas fa-sync-alt mr-1"></i>Update Now
              </div>
            </div>
          </div>
        </div>

      
        <div className="col-lg-3 col-sm-6">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-dollar-sign text-success"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Revenue</p>
                    <h4 className="card-title">$1,345</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="far fa-calendar-alt mr-1"></i>Last day
              </div>
            </div>
          </div>
        </div>

   
        <div className="col-lg-3 col-sm-6">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-exclamation-triangle text-danger"></i>
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Errors</p>
                    <h4 className="card-title">23</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="far fa-clock mr-1"></i>In the last hour
              </div>
            </div>
          </div>
        </div>

   
        <div className="col-lg-3 col-sm-6">
          <div className="card-stats card">
            <div className="card-body">
              <div className="row">
                <div className="col-5">
                  <div className="icon-big text-center icon-warning">
                    <i className="fas fa-users text-primary"></i> 
                  </div>
                </div>
                <div className="col-7">
                  <div className="numbers">
                    <p className="card-category">Followers</p>
                    <h4 className="card-title">+45K</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <hr />
              <div className="stats">
                <i className="fas fa-sync-alt mr-1"></i>Update now
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
