package com.registration.Dto;


import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

public class ExperienceDTO {

	@Id
    private Long id;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Organization is required")
    private String orgname;

    @NotBlank(message = "From Date is required")
    private String fromDate;

    @NotBlank(message = "To Date is required")
    private String toDate;

    private String duration;

   

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOrgname() {
        return orgname;
    }

    public void setOrgname(String orgname) {
        this.orgname = orgname;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
