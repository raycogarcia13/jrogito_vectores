module.exports = {   
  en:{
      messageT:"New warratny report created with code: %code",
      messageH:`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300;8..144,400;8..144,600&display=swap"
            rel="stylesheet"
          />
          <title>ET_01</title>
          <style type="text/css">
            * {
              font-family: "Roboto Flex", sans-serif;
              box-sizing: border-box;
            }
            body {
              width: 100%;
              margin: 0;
            }
            a {
              color: white;
              text-decoration: unset;
            }
            .header {
              padding: 4px 20px;
            }
            .content {
              width: 100%;
              max-width: 600px;
              border:1px solid #016936;
              border-radius: 4px;
            }
            .innerpadding {
              padding: 0 20px 20px 20px;
            }
            .top-padding {
              padding-top: 20px;
            }
            .borderbottom {
              border-bottom: 1px solid #016936;
            }      
            .tag {
              background-color: #016936;
              color: #fff;
              padding: 2px 6px;
              border-radius: 12px;
            }
            h3 {
              margin: 0;
            }
            .btn-primary {
              margin-top: 12px;
              background-color: #017f81;
              padding: 12px 22px;
              color: #fff;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            }
          </style>
        </head>

        <body>
          <table
            width="100%"
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="padding: 50px 8px;"
          >
            <tr>
              <td>
                <table
                  bgcolor="#f6f8f1"
                  class="content"
                  align="center"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td bgcolor="#016936" class="header" style="width: 100%;">
                      <table
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td height="70">
                            <h2 style="color: #fff;">AISCO WORKSPACE</h2>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding top-padding">
                      <table
                        width="250"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <h3>NEW CLAIM REPORTED</h3>
                          </td>
                        </tr>
                      </table>
                      <table
                        align="right"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; max-width: 100px"
                      >
                        <tr>
                          <td>
                            <table
                              width="70"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td><span class="tag">%code</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="120"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <strong>Customer</strong>
                          </td>
                        </tr>
                      </table>
                      <table
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; max-width: 245px"
                      >
                        <tr>
                          <td>
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td><span>%customer</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="120"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <strong>Dealer</strong>
                          </td>
                        </tr>
                      </table>
                      <table
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; max-width: 245px"
                      >
                        <tr>
                          <td>
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td>
                                    <span>%dealer</span>                            
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="120"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <strong>Country</strong>
                          </td>
                        </tr>
                      </table>
                      <table
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; max-width: 245px"
                      >
                        <tr>
                          <td>
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td>
                                    <span>%country</span>                            
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="50%"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <table
                              width="120"
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td>
                                  <strong>System failure date</strong>
                                </td>
                              </tr>
                            </table>
                            <table
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%; max-width: 100px"
                            >
                              <tr>
                                <td>
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td>
                                        <span>%problem_date</span>                            
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table
                        width="50%"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <table
                              width="120"
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td>
                                  <strong>Report date</strong>
                                </td>
                              </tr>
                            </table>
                            <table
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%; max-width: 100px"
                            >
                              <tr>
                                <td>
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td>
                                        <span>%report_date</span>                            
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="50%"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <table
                              width="120"
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td>
                                  <strong>Aisco Sales Order</strong>
                                </td>
                              </tr>
                            </table>
                            <table
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%; max-width: 100px"
                            >
                              <tr>
                                <td>
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td>
                                        <span>%aisco_sales_order</span>                            
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table
                        width="50%"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <table
                              width="120"
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                            >
                              <tr>
                                <td>
                                  <strong>Invoice</strong>
                                </td>
                              </tr>
                            </table>
                            <table
                              align="left"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="width: 100%; max-width: 100px"
                            >
                              <tr>
                                <td>
                                  <table
                                    width="100%"
                                    border="0"
                                    cellspacing="0"
                                    cellpadding="0"
                                  >
                                    <tr>
                                      <td>
                                        <span>%invoice</span>                            
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="120"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td>
                            <strong>Machine serial number</strong>
                          </td>
                        </tr>
                      </table>
                      <table
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; max-width: 245px"
                      >
                        <tr>
                          <td>
                            <table
                              width="100%"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tr>
                                <td><span>%machine_serial_number</span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                      <table
                        width="100%"
                        align="left"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                      <tr><td style="width: 100%;" class="borderbottom"></td></tr>
                    </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 20px 0;">
                            <h3>Problem description</h3>
                    </td>
                  </tr>
                  <tr>
                    <td class="innerpadding">
                            <span>%problem_description</span>
                    </td>
                  </tr>
                  <tr>
                      <td style="padding-bottom:20px; text-align:center">
                        <a type="button"  href="%link" class="btn-primary" style="color:#fff; text-decoration: none;"><strong>View Claim</strong></a>
                      </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>

      `,
      subject:"New warranty report"
  }
}