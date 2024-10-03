const readline = require("readline");

// Create a readline interface for command line input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class JobLibrary {
  constructor() {
    this.jobs = [];
  }

  // Method to add a job
  addJob(job) {
    if (this._validateJob(job)) {
      this.jobs.push(job);
      console.log(`Job '${job.title}' added successfully!`);
    } else {
      console.log(
        "Invalid job structure. Please ensure all required fields are present."
      );
    }
  }

  // Method to remove a job by title
  removeJobField(title) {
    const job = this.jobs.find((job) => job.title === title);

    if (!job) {
      console.log(`Job '${title}' not found.`);
      return;
    }

    rl.question(
      "Which field do you want to remove? (title, type, description, location, salary, company)\n",
      (field) => {
        if (
          ["title", "type", "description", "location", "salary"].includes(field)
        ) {
          job[field] = "";
          console.log(`Field '${field}' has been removed from job '${title}'.`);
        } else if (field === "company") {
          rl.question(
            "Which company field do you want to remove? (name, description, contactEmail, contactPhone)\n",
            (companyField) => {
              if (
                [
                  "name",
                  "description",
                  "contactEmail",
                  "contactPhone",
                ].includes(companyField)
              ) {
                job.company[companyField] = "";
                console.log(
                  `Company field '${companyField}' has been removed from job '${title}'.`
                );
              } else {
                console.log("Invalid company field. Please try again.");
              }
              userMenu();
            }
          );
        } else {
          console.log("Invalid field. Please try again.");
          userMenu();
        }
      }
    );
  }

  // Method to update a job by title
  updateJob(title, updatedFields) {
    const job = this.jobs.find((job) => job.title === title);
    if (job) {
      Object.assign(job, updatedFields);
      console.log(`Job '${title}' updated successfully!`);
    } else {
      console.log(`Job '${title}' not found.`);
    }
  }

  // Method to delete a job by title
  deleteJob(title) {
    const jobIndex = this.jobs.findIndex((job) => job.title === title);

    if (jobIndex !== -1) {
      this.jobs.splice(jobIndex, 1);
      console.log(`Job '${title}' deleted successfully.`);
    } else {
      console.log(`Job '${title}' not found.`);
    }
  }

  // Method to list all jobs
  listJobs() {
    if (this.jobs.length === 0) {
      console.log("No jobs found.");
    } else {
      console.log("Listing all jobs:");
      this.jobs.forEach((job, index) => {
        console.log(`\nJob ${index + 1}:`);
        console.log(`Title: ${job.title}`);
        console.log(`Type: ${job.type}`);
        console.log(`Description: ${job.description}`);
        console.log(`Location: ${job.location}`);
        console.log(`Salary: ${job.salary}`);
        console.log("Company:");
        console.log(`  - Company name: ${job.company.name}`);
        console.log(`  - Company description: ${job.company.description}`);
        console.log(`  - Company Email: ${job.company.contactEmail}`);
        console.log(`  - Company Phone: ${job.company.contactPhone}`);
      });
    }
  }

  // Internal method to validate job structure
  _validateJob(job) {
    const requiredFields = [
      "title",
      "type",
      "description",
      "location",
      "salary",
      "company",
    ];
    const requiredCompanyFields = [
      "name",
      "description",
      "contactEmail",
      "contactPhone",
    ];

    // Check if required fields are present in job object
    for (let field of requiredFields) {
      if (!job.hasOwnProperty(field)) {
        return false;
      }
    }

    // Check if required fields are present in company object
    for (let field of requiredCompanyFields) {
      if (!job.company || !job.company.hasOwnProperty(field)) {
        return false;
      }
    }

    return true;
  }
}

// Initialize job library
const jobLib = new JobLibrary();

// Function to prompt the user for updated job details
function updateJobFromInput(title) {
  if (jobLib.jobs.length === 0) {
    console.log("No jobs available to update.");
    userMenu(); // Return to the menu if no jobs are available
    return;
  }
  const updatedFields = { company: {} };

  rl.question("Enter new job title (or leave empty to skip): ", (newTitle) => {
    if (newTitle) updatedFields.title = newTitle;

    rl.question(
      "Enter new job type (Full-Time/Part-Time) (or leave empty to skip): ",
      (newType) => {
        if (newType) updatedFields.type = newType;

        rl.question(
          "Enter new job description (or leave empty to skip): ",
          (newDescription) => {
            if (newDescription) updatedFields.description = newDescription;

            rl.question(
              "Enter new job location (or leave empty to skip): ",
              (newLocation) => {
                if (newLocation) updatedFields.location = newLocation;

                rl.question(
                  "Enter new job salary (or leave empty to skip): ",
                  (newSalary) => {
                    if (newSalary) updatedFields.salary = newSalary;

                    rl.question(
                      "Enter new company name (or leave empty to skip): ",
                      (newCompanyName) => {
                        if (newCompanyName)
                          updatedFields.company.name = newCompanyName;

                        rl.question(
                          "Enter new company description (or leave empty to skip): ",
                          (newCompanyDescription) => {
                            if (newCompanyDescription)
                              updatedFields.company.description =
                                newCompanyDescription;

                            rl.question(
                              "Enter new company contact email (or leave empty to skip): ",
                              (newContactEmail) => {
                                if (newContactEmail)
                                  updatedFields.company.contactEmail =
                                    newContactEmail;

                                rl.question(
                                  "Enter new company contact phone (or leave empty to skip): ",
                                  (newContactPhone) => {
                                    if (newContactPhone)
                                      updatedFields.company.contactPhone =
                                        newContactPhone;

                                    // Only update the fields that have been provided
                                    const currentJob = jobLib.jobs.find(
                                      (job) => job.title === title
                                    );

                                    // Merge only non-empty fields into the existing job
                                    Object.keys(updatedFields).forEach(
                                      (field) => {
                                        if (field === "company") {
                                          Object.keys(
                                            updatedFields.company
                                          ).forEach((companyField) => {
                                            if (
                                              updatedFields.company[
                                                companyField
                                              ]
                                            ) {
                                              currentJob.company[companyField] =
                                                updatedFields.company[
                                                  companyField
                                                ];
                                            }
                                          });
                                        } else if (updatedFields[field]) {
                                          currentJob[field] =
                                            updatedFields[field];
                                        }
                                      }
                                    );

                                    // Confirm the update
                                    console.log(
                                      `Job '${title}' updated successfully!`
                                    );

                                    // Go back to the main menu
                                    userMenu();
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

// Menu function for user choice
function userMenu() {
  rl.question(
    "Select an option:\n1. Add Job\n2. Remove Job\n3. Update Job\n4. Delete Job\n5. List Jobs\n6. Exit\n",
    (choice) => {
      switch (choice) {
        case "1":
          // Add Job
          addJobFromInput();
          break;

        case "2":
          // Remove Job field
          if (jobLib.jobs.length === 0) {
            console.log("No jobs available to modify.");
            userMenu();
          } else {
            rl.question(
              "Enter the title of the job you want to modify: ",
              (removeTitle) => {
                jobLib.removeJobField(removeTitle);
              }
            );
          }
          return;

        case "3":
          // Update Job
          if (jobLib.jobs.length === 0) {
            console.log("No jobs available to update.");
            userMenu();
          } else {
            rl.question(
              "Enter the title of the job you want to update: ",
              (updateTitle) => {
                updateJobFromInput(updateTitle);
              }
            );
          }
          return;

        case "4":
          // Delete Job
          if (jobLib.jobs.length === 0) {
            console.log("No jobs available to delete.");
            userMenu();
          } else {
            rl.question(
              "Enter the title of the job you want to delete: ",
              (deleteTitle) => {
                jobLib.deleteJob(deleteTitle);
                userMenu();
              }
            );
          }
          return;

        case "5":
          // List all jobs
          jobLib.listJobs();
          userMenu();
          return;

        case "6":
          // Exit
          console.log("Exiting the program...");
          rl.close();
          return;

        default:
          console.log("Invalid choice. Please try again.");
      }

      // Call the menu again
      userMenu();
    }
  );
}

// Function to prompt the user for job details
function addJobFromInput() {
  const job = { company: {} };

  rl.question("Enter job title: ", (title) => {
    job.title = title;

    rl.question("Enter job type (Full-Time/Part-Time): ", (type) => {
      job.type = type;

      rl.question("Enter job description: ", (description) => {
        job.description = description;

        rl.question("Enter job location: ", (location) => {
          job.location = location;

          rl.question("Enter job salary: ", (salary) => {
            job.salary = salary;

            rl.question("Enter company name: ", (companyName) => {
              job.company.name = companyName;

              rl.question(
                "Enter company description: ",
                (companyDescription) => {
                  job.company.description = companyDescription;

                  rl.question(
                    "Enter company contact email: ",
                    (contactEmail) => {
                      job.company.contactEmail = contactEmail;

                      rl.question(
                        "Enter company contact phone: ",
                        (contactPhone) => {
                          job.company.contactPhone = contactPhone;

                          // Add the job to the library
                          jobLib.addJob(job);

                          // Go back to the main menu
                          userMenu();
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      });
    });
  });
}

// Start the user menu
userMenu();
